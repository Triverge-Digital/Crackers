import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default ?? false,
              };
            }
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  const countries = ["in"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        {
          currency_code: "inr",
          is_default: true,
        },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });
  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "India",
          currency_code: "inr",
          countries,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "BW Crackers Warehouse",
          address: {
            city: "Sivakasi",
            country_code: "IN",
            address_1: "Sivakasi Main Road",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
      },
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "India Delivery",
    type: "shipping",
    service_zones: [
      {
        name: "India",
        geo_zones: [
          {
            country_code: "in",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Delivery in 3-5 business days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "inr",
            amount: 100,
          },
          {
            region_id: region.id,
            amount: 100,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Delivery in 1-2 business days.",
          code: "express",
        },
        prices: [
          {
            currency_code: "inr",
            amount: 250,
          },
          {
            region_id: region.id,
            amount: 250,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
    container
  ).run({
    input: {
      api_keys: [
        {
          title: "BW Crackers Storefront",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });
  const publishableApiKey = publishableApiKeyResult[0];

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding product categories...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        { name: "Single Sound Crackers", is_active: true },
        { name: "Deluxe Crackers", is_active: true },
        { name: "Bijili Crackers", is_active: true },
        { name: "Rockets", is_active: true },
        { name: "Candles", is_active: true },
        { name: "Color Pencil", is_active: true },
        { name: "Night Crackling Effects", is_active: true },
        { name: "Premium Gift Boxes", is_active: true },
      ],
    },
  });

  const catMap = Object.fromEntries(
    categoryResult.map((c) => [c.name, c.id])
  );

  logger.info("Seeding product data...");

  // Product data from Excel price list
  const productsData = [
    // Single Sound Crackers
    { code: "1", title: '2 3/4" Kuruvi', mrp: 40, discountPrice: 8, unit: "1 PKT", category: "Single Sound Crackers", image: "/images/products/product-1.jpeg" },
    { code: "2", title: '3 1/2" Lakshmi', mrp: 80, discountPrice: 16, unit: "1 PKT", category: "Single Sound Crackers", image: "/images/products/product-2.jpeg" },
    { code: "3", title: '4" Lakshmi', mrp: 100, discountPrice: 20, unit: "1 PKT", category: "Single Sound Crackers", image: "/images/products/product-3.jpeg" },
    { code: "4", title: '4" Deluxe Lakshmi', mrp: 150, discountPrice: 30, unit: "1 PKT", category: "Single Sound Crackers", image: "/images/products/product-4.jpeg" },
    { code: "5", title: '4" Gold Lakshmi', mrp: 175, discountPrice: 35, unit: "1 PKT", category: "Single Sound Crackers", image: "/images/products/product-5.jpeg" },
    { code: "6", title: '5" Mega Lakshmi', mrp: 190, discountPrice: 38, unit: "1 PKT", category: "Single Sound Crackers", image: "/images/products/product-6.jpeg" },
    { code: "7", title: "2 Sound Crackers", mrp: 175, discountPrice: 35, unit: "1 PKT", category: "Single Sound Crackers", image: "/images/products/product-7.jpeg" },
    { code: "8", title: "Elephant Crackers", mrp: 250, discountPrice: 50, unit: "1 PKT", category: "Single Sound Crackers", image: "/images/products/product-8.jpeg" },
    { code: "9", title: "28 Chorsa", mrp: 70, discountPrice: 14, unit: "1 PKT", category: "Single Sound Crackers", image: "/images/products/product-9.jpeg" },
    { code: "10", title: "28 Giant", mrp: 120, discountPrice: 24, unit: "1 PKT", category: "Single Sound Crackers", image: "/images/products/product-10.jpeg" },
    { code: "11", title: "56 Giant", mrp: 200, discountPrice: 40, unit: "1 PKT", category: "Single Sound Crackers", image: "/images/products/product-11.jpeg" },

    // Deluxe Crackers
    { code: "12", title: "24 Deluxe", mrp: 250, discountPrice: 50, unit: "1 PKT", category: "Deluxe Crackers", image: "/images/products/product-12.jpeg" },
    { code: "13", title: "50 Deluxe", mrp: 500, discountPrice: 100, unit: "1 PKT", category: "Deluxe Crackers", image: "/images/products/product-13.jpeg" },
    { code: "14", title: "100 Deluxe", mrp: 1100, discountPrice: 220, unit: "1 PKT", category: "Deluxe Crackers", image: "/images/products/product-14.jpeg" },

    // Bijili Crackers
    { code: "15", title: "Red Bijili", mrp: 160, discountPrice: 32, unit: "1 PKT", category: "Bijili Crackers", image: "/images/products/product-15.jpeg" },
    { code: "16", title: "Stripped Bijili", mrp: 170, discountPrice: 34, unit: "1 PKT", category: "Bijili Crackers", image: "/images/products/product-16.jpeg" },

    // Rockets
    { code: "17", title: "Baby Rocket", mrp: 300, discountPrice: 60, unit: "1 BOX", category: "Rockets", image: "/images/products/product-17.jpeg" },
    { code: "18", title: "Rocket Bomb", mrp: 450, discountPrice: 90, unit: "1 BOX", category: "Rockets", image: "/images/products/product-18.jpeg" },
    { code: "19", title: "Lunik Rocket", mrp: 700, discountPrice: 140, unit: "1 BOX", category: "Rockets", image: "/images/products/product-19.jpeg" },
    { code: "20", title: "Musical Rocket", mrp: 900, discountPrice: 180, unit: "1 BOX", category: "Rockets", image: "/images/products/product-20.jpeg" },
    { code: "21", title: "2 Sound Rocket", mrp: 1000, discountPrice: 200, unit: "1 BOX", category: "Rockets", image: "/images/products/product-21.jpeg" },

    // Candles
    { code: "22", title: '7" Magic Pencil', mrp: 125, discountPrice: 25, unit: "1 BOX", category: "Candles", image: "/images/products/product-22.jpeg" },
    { code: "23", title: '12" Pencil', mrp: 275, discountPrice: 55, unit: "1 BOX", category: "Candles", image: "/images/products/product-23.jpeg" },

    // Color Pencil
    { code: "24", title: "Ultra Pencil (3pcs)", mrp: 400, discountPrice: 80, unit: "1 BOX", category: "Color Pencil", image: "/images/products/product-24.jpeg" },
    { code: "25", title: "Navarag Pencil (5pcs)", mrp: 1000, discountPrice: 200, unit: "1 BOX", category: "Color Pencil", image: "/images/products/product-25.jpeg" },
    { code: "26", title: "Popcorn Pencil (5pcs)", mrp: 1200, discountPrice: 240, unit: "1 BOX", category: "Color Pencil", image: "/images/products/product-26.jpeg" },
    { code: "27", title: "Selfie Stick (5pcs)", mrp: 1000, discountPrice: 200, unit: "1 BOX", category: "Color Pencil", image: "/images/products/product-27.jpeg" },

    // Night Crackling Effects
    { code: "28", title: "Bat and Ball", mrp: 1400, discountPrice: 280, unit: "1 BOX", category: "Night Crackling Effects", image: "/images/products/product-28.jpeg" },
    { code: "29", title: "Emu Egg", mrp: 1250, discountPrice: 250, unit: "1 BOX", category: "Night Crackling Effects", image: "/images/products/product-29.jpeg" },
    { code: "30", title: "Tim Tam", mrp: 500, discountPrice: 100, unit: "1 BOX", category: "Night Crackling Effects", image: "/images/products/product-30.jpeg" },
    { code: "31", title: "White House", mrp: 800, discountPrice: 160, unit: "1 BOX", category: "Night Crackling Effects", image: "/images/products/product-31.jpeg" },
    { code: "32", title: "Color Celebrate (5pcs)", mrp: 1500, discountPrice: 300, unit: "1 BOX", category: "Night Crackling Effects", image: "/images/products/product-32.jpeg" },

    // Premium Gift Boxes
    { code: "157", title: "Sunrises (22 Items)", mrp: 1500, discountPrice: 300, unit: "1 BOX", category: "Premium Gift Boxes", image: "/images/products/product-33.jpeg" },
    { code: "158", title: "Royal King (26 Items)", mrp: 1900, discountPrice: 380, unit: "1 BOX", category: "Premium Gift Boxes", image: "/images/products/product-34.jpeg" },
    { code: "159", title: "Mumbai Indians (31 Items)", mrp: 2400, discountPrice: 480, unit: "1 BOX", category: "Premium Gift Boxes", image: "/images/products/product-35.jpeg" },
    { code: "160", title: "Chennai Super Kings (42 Items)", mrp: 3500, discountPrice: 690, unit: "1 BOX", category: "Premium Gift Boxes", image: "/images/products/product-36.jpeg" },
    { code: "161", title: "Andal Nachiyar (51 Items)", mrp: 4500, discountPrice: 890, unit: "1 BOX", category: "Premium Gift Boxes", image: "/images/products/product-37.jpeg" },
  ];

  const handle = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  await createProductsWorkflow(container).run({
    input: {
      products: productsData.map((p) => ({
        title: p.title,
        category_ids: [catMap[p.category]],
        description: `${p.title} - ${p.category}. MRP: ₹${p.mrp}. Special 80% discount price: ₹${p.discountPrice}. Sold as ${p.unit}.`,
        handle: handle(p.title),
        weight: 500,
        status: ProductStatus.PUBLISHED,
        shipping_profile_id: shippingProfile.id,
        images: [{ url: p.image }],
        options: [
          {
            title: "Unit",
            values: [p.unit],
          },
        ],
        variants: [
          {
            title: p.unit,
            sku: `BW-${p.code}`,
            options: {
              Unit: p.unit,
            },
            prices: [
              {
                amount: p.discountPrice,
                currency_code: "inr",
              },
            ],
          },
        ],
        sales_channels: [
          {
            id: defaultSalesChannel[0].id,
          },
        ],
      })),
    },
  });
  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    const inventoryLevel = {
      location_id: stockLocation.id,
      stocked_quantity: 1000000,
      inventory_item_id: inventoryItem.id,
    };
    inventoryLevels.push(inventoryLevel);
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding inventory levels data.");
}
