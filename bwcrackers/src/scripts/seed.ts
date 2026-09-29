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
} from "@medusajs/medusa/core-flows";

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

  await storeModuleService.updateStores(store.id, {
    supported_currencies: [
      {
        currency_code: "inr",
        is_default: true,
      },
    ],
    default_sales_channel_id: defaultSalesChannel[0].id,
  } as any);
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

  await storeModuleService.updateStores(store.id, {
    default_location_id: stockLocation.id,
  } as any);

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
        { name: "One Sound Crackers", is_active: true },
        { name: "Deluxe Crackers", is_active: true },
        { name: "Bijili Crackers", is_active: true },
        { name: "Rockets", is_active: true },
        { name: "Candles", is_active: true },
        { name: "Mega Colour Pencil", is_active: true },
        { name: "Night Crackling Effects", is_active: true },
        { name: "Budget Beats", is_active: true },
        { name: "Special Beats", is_active: true },
        { name: "Flower Pots", is_active: true },
        { name: "Ground Chakkars", is_active: true },
        { name: "Atom Bombs", is_active: true },
        { name: "Glitters", is_active: true },
        { name: "Whistling Items", is_active: true },
        { name: "Sky Showers", is_active: true },
        { name: "Paper Bomb", is_active: true },
        { name: "Shower Fountain", is_active: true },
        { name: "Fancy Items", is_active: true },
        { name: "Sky Fancy Items", is_active: true },
        { name: "Sky Shots", is_active: true },
        { name: "Hollywood Fountain", is_active: true },
        { name: "Kuitites Items", is_active: true },
        { name: "Fancy Mega Chakkar", is_active: true },
        { name: "Sparklers", is_active: true },
        { name: "Colour Matches", is_active: true },
        { name: "Hi Fi Fancy Items", is_active: true },
        { name: "Diwali Special Combo Packs", is_active: true }
      ],
    },
  });

  const catMap = Object.fromEntries(
    categoryResult.map((c) => [c.name, c.id])
  );

  logger.info("Seeding product data...");

// Product data from B&W Crackers 2026 printed price list
  const productsData = [
    { code: "1", title: "2 1/2\" Kuruvi", mrp: 45, discountPrice: 9, unit: "1 PKT", category: "One Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988630/bwcrackers/bw-1-2-3-4-kuruvi.jpg" },
    { code: "2", title: "3 1/2\" Lakshmi / Spiderman", mrp: 80, discountPrice: 16, unit: "1 PKT", category: "One Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988643/bwcrackers/bw-3-4-lakshmi.jpg" },
    { code: "3", title: "4\" Lakshmi", mrp: 110, discountPrice: 22, unit: "1 PKT", category: "One Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988643/bwcrackers/bw-3-4-lakshmi.jpg" },
    { code: "4", title: "4\" Deluxe Lakshmi (3 Ply)", mrp: 150, discountPrice: 30, unit: "1 PKT", category: "One Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988648/bwcrackers/bw-12-24-deluxe.jpg" },
    { code: "5", title: "4\" Gold Lakshmi", mrp: 210, discountPrice: 42, unit: "1 PKT", category: "One Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988643/bwcrackers/bw-3-4-lakshmi.jpg" },
    { code: "6", title: "5\" Mega Lakshmi", mrp: 210, discountPrice: 42, unit: "1 PKT", category: "One Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988643/bwcrackers/bw-3-4-lakshmi.jpg" },
    { code: "7", title: "2 Sound Crackers", mrp: 190, discountPrice: 38, unit: "1 PKT", category: "One Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988645/bwcrackers/bw-7-2-sound-crackers.jpg" },
    { code: "8", title: "Mega Deluxe Lakshmi", mrp: 300, discountPrice: 60, unit: "1 PKT", category: "One Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988646/bwcrackers/bw-8-elephant-crackers.jpg" },
    { code: "9", title: "28 Chorsa", mrp: 70, discountPrice: 14, unit: "1 PKT", category: "One Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988630/bwcrackers/bw-1-2-3-4-kuruvi.jpg" },
    { code: "10", title: "28 Giant", mrp: 110, discountPrice: 22, unit: "1 PKT", category: "One Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988630/bwcrackers/bw-1-2-3-4-kuruvi.jpg" },
    { code: "11", title: "56 Giant", mrp: 220, discountPrice: 44, unit: "1 PKT", category: "One Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988630/bwcrackers/bw-1-2-3-4-kuruvi.jpg" },
    { code: "12", title: "24 Deluxe Crackers", mrp: 250, discountPrice: 50, unit: "1 PKT", category: "Deluxe Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988648/bwcrackers/bw-12-24-deluxe.jpg" },
    { code: "13", title: "50 Deluxe Crackers", mrp: 750, discountPrice: 150, unit: "1 PKT", category: "Deluxe Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988648/bwcrackers/bw-12-24-deluxe.jpg" },
    { code: "14", title: "100 Wala Deluxe Crackers", mrp: 1500, discountPrice: 300, unit: "1 PKT", category: "Deluxe Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988648/bwcrackers/bw-12-24-deluxe.jpg" },
    { code: "15", title: "Red Bijili", mrp: 175, discountPrice: 35, unit: "1 BAG", category: "Bijili Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988650/bwcrackers/bw-15-red-bijili.jpg" },
    { code: "16", title: "Stripped Bijili", mrp: 190, discountPrice: 38, unit: "1 BAG", category: "Bijili Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988652/bwcrackers/bw-16-stripped-bijili.jpg" },
    { code: "17", title: "Baby Rocket (10 Pcs)", mrp: 225, discountPrice: 45, unit: "1 BOX", category: "Rockets", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988654/bwcrackers/bw-17-baby-rocket.jpg" },
    { code: "18", title: "Rocket Bomb (10 Pcs)", mrp: 375, discountPrice: 75, unit: "1 BOX", category: "Rockets", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988657/bwcrackers/bw-18-rocket-bomb.jpg" },
    { code: "19", title: "Lunik Rocket (10 Pcs)", mrp: 750, discountPrice: 150, unit: "1 BOX", category: "Rockets", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988659/bwcrackers/bw-19-lunik-rocket.jpg" },
    { code: "20", title: "Musical Rocket (10 Pcs)", mrp: 800, discountPrice: 160, unit: "1 BOX", category: "Rockets", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988662/bwcrackers/bw-20-musical-rocket.jpg" },
    { code: "21", title: "2 Sound Rocket", mrp: 900, discountPrice: 180, unit: "1 BOX", category: "Rockets", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988664/bwcrackers/bw-21-2-sound-rocket.jpg" },
    { code: "22", title: "7\" Magic Pencil", mrp: 160, discountPrice: 32, unit: "1 BOX", category: "Candles", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988666/bwcrackers/bw-22-7-magic-pencil.jpg" },
    { code: "23", title: "12\" Pencil", mrp: 375, discountPrice: 75, unit: "1 BOX", category: "Candles", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988668/bwcrackers/bw-23-12-pencil.jpg" },
    { code: "24", title: "Ultra Pencil (3 Pcs)", mrp: 400, discountPrice: 80, unit: "1 BOX", category: "Mega Colour Pencil", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988669/bwcrackers/bw-24-ultra-pencil-3pcs.jpg" },
    { code: "25", title: "Pop Corn Pencil Mixing (5 Pcs)", mrp: 1200, discountPrice: 240, unit: "1 BOX", category: "Mega Colour Pencil", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988675/bwcrackers/bw-26-popcorn-pencil-5pcs.jpg" },
    { code: "26", title: "Selfi Stick (5 Pcs)", mrp: 900, discountPrice: 180, unit: "1 BOX", category: "Mega Colour Pencil", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988677/bwcrackers/bw-27-selfie-stick-5pcs.jpg" },
    { code: "27", title: "Sivakasi Pencil (2 Pcs)", mrp: 1200, discountPrice: 240, unit: "1 BOX", category: "Mega Colour Pencil", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988671/bwcrackers/bw-25-navarag-pencil-5pcs.jpg" },
    { code: "28", title: "Water Fuly Pencil", mrp: 1200, discountPrice: 240, unit: "1 BOX", category: "Mega Colour Pencil", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988669/bwcrackers/bw-24-ultra-pencil-3pcs.jpg" },
    { code: "29", title: "Pop Corn Pencil", mrp: 1200, discountPrice: 240, unit: "1 BOX", category: "Mega Colour Pencil", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988675/bwcrackers/bw-26-popcorn-pencil-5pcs.jpg" },
    { code: "30", title: "Bat Ball", mrp: 1250, discountPrice: 250, unit: "1 BOX", category: "Night Crackling Effects", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988679/bwcrackers/bw-28-bat-and-ball.jpg" },
    { code: "31", title: "Emu Egg", mrp: 1250, discountPrice: 250, unit: "1 BOX", category: "Night Crackling Effects", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988681/bwcrackers/bw-29-emu-egg.jpg" },
    { code: "32", title: "White House", mrp: 850, discountPrice: 170, unit: "1 BOX", category: "Night Crackling Effects", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988684/bwcrackers/bw-31-white-house.jpg" },
    { code: "33", title: "Colour Celebration", mrp: 1500, discountPrice: 300, unit: "1 BOX", category: "Night Crackling Effects", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988686/bwcrackers/bw-32-color-celebrate-5pcs.jpg" },
    { code: "34", title: "1000 Beats", mrp: 850, discountPrice: 170, unit: "1 BOX", category: "Budget Beats", image: "https://images.unsplash.com/photo-1549413243-982c7f5c22f6?auto=format&fit=crop&q=80&w=1200" },
    { code: "35", title: "2000 Beats", mrp: 1700, discountPrice: 340, unit: "1 BOX", category: "Budget Beats", image: "https://images.unsplash.com/photo-1549413243-982c7f5c22f6?auto=format&fit=crop&q=80&w=1200" },
    { code: "36", title: "5000 Beats", mrp: 4250, discountPrice: 850, unit: "1 BOX", category: "Budget Beats", image: "https://images.unsplash.com/photo-1549413243-982c7f5c22f6?auto=format&fit=crop&q=80&w=1200" },
    { code: "37", title: "10000 Beats", mrp: 8500, discountPrice: 1700, unit: "1 BOX", category: "Budget Beats", image: "https://images.unsplash.com/photo-1549413243-982c7f5c22f6?auto=format&fit=crop&q=80&w=1200" },
    { code: "38", title: "1000 Beats", mrp: 1500, discountPrice: 300, unit: "1 BOX", category: "Special Beats", image: "https://images.unsplash.com/photo-1549413243-982c7f5c22f6?auto=format&fit=crop&q=80&w=1200" },
    { code: "39", title: "2000 Beats", mrp: 3500, discountPrice: 700, unit: "1 BOX", category: "Special Beats", image: "https://images.unsplash.com/photo-1549413243-982c7f5c22f6?auto=format&fit=crop&q=80&w=1200" },
    { code: "40", title: "5000 Beats", mrp: 7500, discountPrice: 1500, unit: "1 BOX", category: "Special Beats", image: "https://images.unsplash.com/photo-1549413243-982c7f5c22f6?auto=format&fit=crop&q=80&w=1200" },
    { code: "41", title: "10000 Beats", mrp: 15000, discountPrice: 3000, unit: "1 BOX", category: "Special Beats", image: "https://images.unsplash.com/photo-1549413243-982c7f5c22f6?auto=format&fit=crop&q=80&w=1200" },
    { code: "42", title: "Flower Pots Small", mrp: 300, discountPrice: 60, unit: "1 BOX", category: "Flower Pots", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988682/bwcrackers/bw-30-tim-tam.jpg" },
    { code: "43", title: "Flower Pots Big", mrp: 425, discountPrice: 85, unit: "1 BOX", category: "Flower Pots", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988682/bwcrackers/bw-30-tim-tam.jpg" },
    { code: "44", title: "Flower Pots Special", mrp: 550, discountPrice: 110, unit: "1 BOX", category: "Flower Pots", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988682/bwcrackers/bw-30-tim-tam.jpg" },
    { code: "45", title: "Flower Pots Asoka", mrp: 750, discountPrice: 150, unit: "1 BOX", category: "Flower Pots", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988684/bwcrackers/bw-31-white-house.jpg" },
    { code: "46", title: "Flower Pots Deluxe (5 Pcs)", mrp: 1000, discountPrice: 200, unit: "1 BOX", category: "Flower Pots", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988686/bwcrackers/bw-32-color-celebrate-5pcs.jpg" },
    { code: "47", title: "Flower Pots Super Deluxe (2 Pcs)", mrp: 700, discountPrice: 140, unit: "1 BOX", category: "Flower Pots", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988686/bwcrackers/bw-32-color-celebrate-5pcs.jpg" },
    { code: "48", title: "Colour Koti (10 Pcs)", mrp: 1200, discountPrice: 240, unit: "1 BOX", category: "Flower Pots", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988686/bwcrackers/bw-32-color-celebrate-5pcs.jpg" },
    { code: "49", title: "Colour Koti Deluxe (10 Pcs)", mrp: 1750, discountPrice: 350, unit: "1 BOX", category: "Flower Pots", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988686/bwcrackers/bw-32-color-celebrate-5pcs.jpg" },
    { code: "50", title: "Mega Colour Koti Deluxe OR Colour Cone (10 Pcs)", mrp: 2500, discountPrice: 500, unit: "1 BOX", category: "Flower Pots", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988686/bwcrackers/bw-32-color-celebrate-5pcs.jpg" },
    { code: "51", title: "Tri Colour Fountain", mrp: 1750, discountPrice: 350, unit: "1 BOX", category: "Flower Pots", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988684/bwcrackers/bw-31-white-house.jpg" },
    { code: "52", title: "Gypsy Window Power Pots (500 Pcs)", mrp: 1000, discountPrice: 200, unit: "1 BOX", category: "Flower Pots", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988682/bwcrackers/bw-30-tim-tam.jpg" },
    { code: "53", title: "Ground Chakkar Big (25 Pcs)", mrp: 525, discountPrice: 105, unit: "1 BOX", category: "Ground Chakkars", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988646/bwcrackers/bw-8-elephant-crackers.jpg" },
    { code: "54", title: "Ground Chakkar Big (10 Pcs)", mrp: 225, discountPrice: 45, unit: "1 BOX", category: "Ground Chakkars", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988646/bwcrackers/bw-8-elephant-crackers.jpg" },
    { code: "55", title: "Ground Chakkar Special", mrp: 350, discountPrice: 70, unit: "1 BOX", category: "Ground Chakkars", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988646/bwcrackers/bw-8-elephant-crackers.jpg" },
    { code: "56", title: "Ground Chakkar Deluxe", mrp: 900, discountPrice: 180, unit: "1 BOX", category: "Ground Chakkars", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988646/bwcrackers/bw-8-elephant-crackers.jpg" },
    { code: "57", title: "Spinner Special Wheel", mrp: 850, discountPrice: 170, unit: "1 BOX", category: "Ground Chakkars", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988648/bwcrackers/bw-12-24-deluxe.jpg" },
    { code: "58", title: "Spinner Deluxe", mrp: 1000, discountPrice: 200, unit: "1 BOX", category: "Ground Chakkars", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988648/bwcrackers/bw-12-24-deluxe.jpg" },
    { code: "59", title: "Hydro Bomb Green", mrp: 450, discountPrice: 90, unit: "1 BOX", category: "Atom Bombs", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988657/bwcrackers/bw-18-rocket-bomb.jpg" },
    { code: "60", title: "King Bomb Green", mrp: 550, discountPrice: 110, unit: "1 BOX", category: "Atom Bombs", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988657/bwcrackers/bw-18-rocket-bomb.jpg" },
    { code: "61", title: "Classic Bomb Green", mrp: 700, discountPrice: 140, unit: "1 BOX", category: "Atom Bombs", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988657/bwcrackers/bw-18-rocket-bomb.jpg" },
    { code: "62", title: "Bullet Bomb", mrp: 200, discountPrice: 40, unit: "1 BOX", category: "Atom Bombs", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988657/bwcrackers/bw-18-rocket-bomb.jpg" },
    { code: "63", title: "King Rider Mega Deluxe Bomb", mrp: 1500, discountPrice: 300, unit: "1 BOX", category: "Atom Bombs", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988657/bwcrackers/bw-18-rocket-bomb.jpg" },
    { code: "64", title: "1 1/2\" Twinkling Star", mrp: 150, discountPrice: 30, unit: "1 BOX", category: "Glitters", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988666/bwcrackers/bw-22-7-magic-pencil.jpg" },
    { code: "65", title: "4\" Twinkling Star", mrp: 350, discountPrice: 70, unit: "1 BOX", category: "Glitters", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988666/bwcrackers/bw-22-7-magic-pencil.jpg" },
    { code: "66", title: "Jil Jill", mrp: 1500, discountPrice: 300, unit: "1 BOX", category: "Glitters", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988686/bwcrackers/bw-32-color-celebrate-5pcs.jpg" },
    { code: "67", title: "Siren (3 Pcs)", mrp: 1250, discountPrice: 250, unit: "1 BOX", category: "Whistling Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988664/bwcrackers/bw-21-2-sound-rocket.jpg" },
    { code: "68", title: "Asrafi Small (10 Pcs)", mrp: 400, discountPrice: 80, unit: "1 BOX", category: "Sky Showers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988659/bwcrackers/bw-19-lunik-rocket.jpg" },
    { code: "69", title: "Asrafi Big", mrp: 450, discountPrice: 90, unit: "1 BOX", category: "Sky Showers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988659/bwcrackers/bw-19-lunik-rocket.jpg" },
    { code: "70", title: "Adiyal - I - 1/4 Kg", mrp: 250, discountPrice: 50, unit: "1 BOX", category: "Paper Bomb", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988657/bwcrackers/bw-18-rocket-bomb.jpg" },
    { code: "71", title: "Adiyal - II - 1/2 Kg", mrp: 500, discountPrice: 100, unit: "1 BOX", category: "Paper Bomb", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988657/bwcrackers/bw-18-rocket-bomb.jpg" },
    { code: "72", title: "Adiyal - III - 1 Kg", mrp: 1000, discountPrice: 200, unit: "1 BOX", category: "Paper Bomb", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988657/bwcrackers/bw-18-rocket-bomb.jpg" },
    { code: "73", title: "Mafia Casini Money Col Bomb (2 Pcs)", mrp: 1500, discountPrice: 300, unit: "1 BOX", category: "Paper Bomb", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988657/bwcrackers/bw-18-rocket-bomb.jpg" },
    { code: "74", title: "Magic Wanted Colour", mrp: 650, discountPrice: 130, unit: "1 BOX", category: "Paper Bomb", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988686/bwcrackers/bw-32-color-celebrate-5pcs.jpg" },
    { code: "75", title: "Shower - 5 IN 1", mrp: 500, discountPrice: 100, unit: "1 BOX", category: "Shower Fountain", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988684/bwcrackers/bw-31-white-house.jpg" },
    { code: "76", title: "Top Gun (5 Pcs)", mrp: 1250, discountPrice: 250, unit: "1 BOX", category: "Shower Fountain", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988664/bwcrackers/bw-21-2-sound-rocket.jpg" },
    { code: "77", title: "7 Shot (5 Pcs)", mrp: 750, discountPrice: 150, unit: "1 BOX", category: "Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988659/bwcrackers/bw-19-lunik-rocket.jpg" },
    { code: "78", title: "12 Shot (colour Bomb)", mrp: 1100, discountPrice: 220, unit: "1 BOX", category: "Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988659/bwcrackers/bw-19-lunik-rocket.jpg" },
    { code: "79", title: "12 Shot (crackling)", mrp: 1000, discountPrice: 200, unit: "1 BOX", category: "Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988659/bwcrackers/bw-19-lunik-rocket.jpg" },
    { code: "80", title: "30 Shot (multi Colour)", mrp: 2000, discountPrice: 400, unit: "1 BOX", category: "Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988662/bwcrackers/bw-20-musical-rocket.jpg" },
    { code: "81", title: "60 Shot (multi Colour)", mrp: 4500, discountPrice: 900, unit: "1 BOX", category: "Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988662/bwcrackers/bw-20-musical-rocket.jpg" },
    { code: "82", title: "120 Shot (multi Colour)", mrp: 9000, discountPrice: 1800, unit: "1 BOX", category: "Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988662/bwcrackers/bw-20-musical-rocket.jpg" },
    { code: "83", title: "240 Shot (multi Colour)", mrp: 17500, discountPrice: 3500, unit: "1 BOX", category: "Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988662/bwcrackers/bw-20-musical-rocket.jpg" },
    { code: "84", title: "Chotta Fancy (1 Pce)", mrp: 250, discountPrice: 50, unit: "1 BOX", category: "Sky Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988654/bwcrackers/bw-17-baby-rocket.jpg" },
    { code: "85", title: "2 1/2\" Fancy (1 Pce)", mrp: 950, discountPrice: 190, unit: "1 BOX", category: "Sky Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988659/bwcrackers/bw-19-lunik-rocket.jpg" },
    { code: "86", title: "3 1/2\" Fancy", mrp: 1500, discountPrice: 300, unit: "1 BOX", category: "Sky Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988659/bwcrackers/bw-19-lunik-rocket.jpg" },
    { code: "87", title: "4\" Fancy Single", mrp: 2100, discountPrice: 420, unit: "1 BOX", category: "Sky Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988662/bwcrackers/bw-20-musical-rocket.jpg" },
    { code: "88", title: "4\" Fancy Window (2 Pcs)", mrp: 4500, discountPrice: 900, unit: "1 BOX", category: "Sky Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988662/bwcrackers/bw-20-musical-rocket.jpg" },
    { code: "89", title: "4\" Fancy Double Balls", mrp: 2750, discountPrice: 550, unit: "1 BOX", category: "Sky Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988662/bwcrackers/bw-20-musical-rocket.jpg" },
    { code: "90", title: "3 Pieces Multi Colour Fancy", mrp: 1750, discountPrice: 350, unit: "1 BOX", category: "Sky Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988686/bwcrackers/bw-32-color-celebrate-5pcs.jpg" },
    { code: "91", title: "5\" Fancy", mrp: 2750, discountPrice: 550, unit: "1 BOX", category: "Sky Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988662/bwcrackers/bw-20-musical-rocket.jpg" },
    { code: "92", title: "Sky Shot Green (10 Pcs)", mrp: 900, discountPrice: 180, unit: "1 BOX", category: "Sky Shots", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988664/bwcrackers/bw-21-2-sound-rocket.jpg" },
    { code: "93", title: "Sky Shot Crackling (10 Pcs)", mrp: 900, discountPrice: 180, unit: "1 BOX", category: "Sky Shots", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988664/bwcrackers/bw-21-2-sound-rocket.jpg" },
    { code: "94", title: "Fox Star (red & Green Crackling)", mrp: 900, discountPrice: 180, unit: "1 BOX", category: "Hollywood Fountain", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988684/bwcrackers/bw-31-white-house.jpg" },
    { code: "95", title: "Big Show (1 Pcs)", mrp: 900, discountPrice: 180, unit: "1 BOX", category: "Hollywood Fountain", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988684/bwcrackers/bw-31-white-house.jpg" },
    { code: "96", title: "Sing Pop (green Crackling)", mrp: 1000, discountPrice: 200, unit: "1 BOX", category: "Hollywood Fountain", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988686/bwcrackers/bw-32-color-celebrate-5pcs.jpg" },
    { code: "97", title: "Magic Peacock (crackling)", mrp: 1100, discountPrice: 220, unit: "1 BOX", category: "Hollywood Fountain", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988686/bwcrackers/bw-32-color-celebrate-5pcs.jpg" },
    { code: "98", title: "Bada Mega Peacock (silver Crackling) (5 Pcs)", mrp: 2000, discountPrice: 400, unit: "1 BOX", category: "Hollywood Fountain", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988686/bwcrackers/bw-32-color-celebrate-5pcs.jpg" },
    { code: "99", title: "Photo Flash Red Blue Green & White", mrp: 600, discountPrice: 120, unit: "1 BOX", category: "Hollywood Fountain", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988666/bwcrackers/bw-22-7-magic-pencil.jpg" },
    { code: "100", title: "Bambara", mrp: 600, discountPrice: 120, unit: "1 BOX", category: "Hollywood Fountain", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988682/bwcrackers/bw-30-tim-tam.jpg" },
    { code: "101", title: "Drone (helicopter Flying)", mrp: 1000, discountPrice: 200, unit: "1 BOX", category: "Hollywood Fountain", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988654/bwcrackers/bw-17-baby-rocket.jpg" },
    { code: "102", title: "Emoji", mrp: 900, discountPrice: 180, unit: "1 BOX", category: "Hollywood Fountain", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988681/bwcrackers/bw-29-emu-egg.jpg" },
    { code: "103", title: "7\" Tin Big Fountain", mrp: 1000, discountPrice: 200, unit: "1 BOX", category: "Hollywood Fountain", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988684/bwcrackers/bw-31-white-house.jpg" },
    { code: "104", title: "Live Show Fountain", mrp: 900, discountPrice: 180, unit: "1 BOX", category: "Hollywood Fountain", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988684/bwcrackers/bw-31-white-house.jpg" },
    { code: "105", title: "Serpent Egg", mrp: 150, discountPrice: 30, unit: "1 BOX", category: "Kuitites Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988681/bwcrackers/bw-29-emu-egg.jpg" },
    { code: "106", title: "Magic Butterfly", mrp: 400, discountPrice: 80, unit: "1 BOX", category: "Kuitites Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988666/bwcrackers/bw-22-7-magic-pencil.jpg" },
    { code: "107", title: "Cartoon", mrp: 250, discountPrice: 50, unit: "1 BOX", category: "Kuitites Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988681/bwcrackers/bw-29-emu-egg.jpg" },
    { code: "108", title: "Mixer Colour Shower", mrp: 450, discountPrice: 90, unit: "1 BOX", category: "Kuitites Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988686/bwcrackers/bw-32-color-celebrate-5pcs.jpg" },
    { code: "109", title: "Disco Wheel (10 Pcs)", mrp: 600, discountPrice: 120, unit: "1 BOX", category: "Fancy Mega Chakkar", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988648/bwcrackers/bw-12-24-deluxe.jpg" },
    { code: "110", title: "4 X 4 Wheel", mrp: 850, discountPrice: 170, unit: "1 BOX", category: "Fancy Mega Chakkar", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988648/bwcrackers/bw-12-24-deluxe.jpg" },
    { code: "111", title: "7cm Electric Sparklers", mrp: 45, discountPrice: 9, unit: "1 BOX", category: "Sparklers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988666/bwcrackers/bw-22-7-magic-pencil.jpg" },
    { code: "112", title: "7cm Colour Sparklers", mrp: 55, discountPrice: 11, unit: "1 BOX", category: "Sparklers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988666/bwcrackers/bw-22-7-magic-pencil.jpg" },
    { code: "113", title: "7cm Green Sparklers", mrp: 65, discountPrice: 13, unit: "1 BOX", category: "Sparklers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988666/bwcrackers/bw-22-7-magic-pencil.jpg" },
    { code: "114", title: "7cm Red Sparklers", mrp: 75, discountPrice: 15, unit: "1 BOX", category: "Sparklers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988666/bwcrackers/bw-22-7-magic-pencil.jpg" },
    { code: "115", title: "10cm Electric Sparklers", mrp: 85, discountPrice: 17, unit: "1 BOX", category: "Sparklers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988668/bwcrackers/bw-23-12-pencil.jpg" },
    { code: "116", title: "10cm Colour Sparklers", mrp: 95, discountPrice: 19, unit: "1 BOX", category: "Sparklers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988668/bwcrackers/bw-23-12-pencil.jpg" },
    { code: "117", title: "10cm Green Sparklers", mrp: 100, discountPrice: 20, unit: "1 BOX", category: "Sparklers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988668/bwcrackers/bw-23-12-pencil.jpg" },
    { code: "118", title: "10cm Red Sparklers", mrp: 110, discountPrice: 22, unit: "1 BOX", category: "Sparklers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988668/bwcrackers/bw-23-12-pencil.jpg" },
    { code: "119", title: "15cm Electric Sparklers", mrp: 175, discountPrice: 35, unit: "1 BOX", category: "Sparklers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988669/bwcrackers/bw-24-ultra-pencil-3pcs.jpg" },
    { code: "120", title: "15cm Colour Sparklers", mrp: 190, discountPrice: 38, unit: "1 BOX", category: "Sparklers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988669/bwcrackers/bw-24-ultra-pencil-3pcs.jpg" },
    { code: "121", title: "15cm Green Sparklers", mrp: 215, discountPrice: 43, unit: "1 BOX", category: "Sparklers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988669/bwcrackers/bw-24-ultra-pencil-3pcs.jpg" },
    { code: "122", title: "15cm Red Sparklers", mrp: 250, discountPrice: 50, unit: "1 BOX", category: "Sparklers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988669/bwcrackers/bw-24-ultra-pencil-3pcs.jpg" },
    { code: "123", title: "30cm Electric Sparklers", mrp: 175, discountPrice: 35, unit: "1 BOX", category: "Sparklers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988671/bwcrackers/bw-25-navarag-pencil-5pcs.jpg" },
    { code: "124", title: "30cm Colour Sparklers", mrp: 190, discountPrice: 38, unit: "1 BOX", category: "Sparklers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988671/bwcrackers/bw-25-navarag-pencil-5pcs.jpg" },
    { code: "125", title: "30cm Green Sparklers", mrp: 215, discountPrice: 43, unit: "1 BOX", category: "Sparklers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988671/bwcrackers/bw-25-navarag-pencil-5pcs.jpg" },
    { code: "126", title: "30cm Red Sparklers", mrp: 250, discountPrice: 50, unit: "1 BOX", category: "Sparklers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988671/bwcrackers/bw-25-navarag-pencil-5pcs.jpg" },
    { code: "127", title: "50cm Electric Sparklers", mrp: 850, discountPrice: 170, unit: "1 BOX", category: "Sparklers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988675/bwcrackers/bw-26-popcorn-pencil-5pcs.jpg" },
    { code: "128", title: "50cm Colour Sparklers", mrp: 900, discountPrice: 180, unit: "1 BOX", category: "Sparklers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988675/bwcrackers/bw-26-popcorn-pencil-5pcs.jpg" },
    { code: "129", title: "50cm 5 IN 1 Multi Colour Sparklers", mrp: 900, discountPrice: 180, unit: "1 BOX", category: "Sparklers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988675/bwcrackers/bw-26-popcorn-pencil-5pcs.jpg" },
    { code: "130", title: "Dancing Sparklers", mrp: 1250, discountPrice: 250, unit: "1 BOX", category: "Sparklers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988677/bwcrackers/bw-27-selfie-stick-5pcs.jpg" },
    { code: "131", title: "Big Box 10 IN 1 Laptop Matches", mrp: 1500, discountPrice: 300, unit: "1 BOX", category: "Colour Matches", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988688/bwcrackers/bw-157-sunrises-22-items.jpg" },
    { code: "132", title: "Jacky John 5 IN 1 Matches", mrp: 1000, discountPrice: 200, unit: "1 BOX", category: "Colour Matches", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988689/bwcrackers/bw-158-royal-king-26-items.jpg" },
    { code: "133", title: "Cap - Roll", mrp: 250, discountPrice: 50, unit: "1 BOX", category: "Colour Matches", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988630/bwcrackers/bw-1-2-3-4-kuruvi.jpg" },
    { code: "134", title: "Rotafer Gun", mrp: 650, discountPrice: 130, unit: "1 BOX", category: "Colour Matches", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988657/bwcrackers/bw-18-rocket-bomb.jpg" },
    { code: "135", title: "Icone (2 Pcs)", mrp: 1400, discountPrice: 280, unit: "1 BOX", category: "Colour Matches", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988691/bwcrackers/bw-159-mumbai-indians-31-items.jpg" },
    { code: "136", title: "Helicopter (10 Pcs)", mrp: 500, discountPrice: 100, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988654/bwcrackers/bw-17-baby-rocket.jpg" },
    { code: "137", title: "Peacock Feathers (5 Pcs)", mrp: 600, discountPrice: 120, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988686/bwcrackers/bw-32-color-celebrate-5pcs.jpg" },
    { code: "138", title: "Colour Smoke (3 Pcs)", mrp: 1250, discountPrice: 250, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988686/bwcrackers/bw-32-color-celebrate-5pcs.jpg" },
    { code: "139", title: "Old Is Gold", mrp: 1000, discountPrice: 200, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988688/bwcrackers/bw-157-sunrises-22-items.jpg" },
    { code: "140", title: "Lolly Pop", mrp: 1250, discountPrice: 250, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988681/bwcrackers/bw-29-emu-egg.jpg" },
    { code: "141", title: "Cock Tail (3 Pcs)", mrp: 1500, discountPrice: 300, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988689/bwcrackers/bw-158-royal-king-26-items.jpg" },
    { code: "142", title: "6\" Water Quin", mrp: 1250, discountPrice: 180, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988684/bwcrackers/bw-31-white-house.jpg" },
    { code: "143", title: "6\" Crackling", mrp: 1250, discountPrice: 250, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988684/bwcrackers/bw-31-white-house.jpg" },
    { code: "144", title: "Black Money (5 Pcs)", mrp: 1250, discountPrice: 250, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988691/bwcrackers/bw-159-mumbai-indians-31-items.jpg" },
    { code: "145", title: "Dora", mrp: 900, discountPrice: 180, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988681/bwcrackers/bw-29-emu-egg.jpg" },
    { code: "146", title: "Madurai - Mali", mrp: 1250, discountPrice: 250, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988692/bwcrackers/bw-160-chennai-super-kings-42-items.jpg" },
    { code: "147", title: "90 Wats", mrp: 800, discountPrice: 160, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988664/bwcrackers/bw-21-2-sound-rocket.jpg" },
    { code: "148", title: "Money IN The Bank", mrp: 1250, discountPrice: 250, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988691/bwcrackers/bw-159-mumbai-indians-31-items.jpg" },
    { code: "149", title: "Money Star", mrp: 1000, discountPrice: 200, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988688/bwcrackers/bw-157-sunrises-22-items.jpg" },
    { code: "150", title: "Once More", mrp: 1000, discountPrice: 200, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988689/bwcrackers/bw-158-royal-king-26-items.jpg" },
    { code: "151", title: "Flying Machine", mrp: 3000, discountPrice: 600, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988654/bwcrackers/bw-17-baby-rocket.jpg" },
    { code: "152", title: "Long Way", mrp: 3000, discountPrice: 600, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988662/bwcrackers/bw-20-musical-rocket.jpg" },
    { code: "153", title: "Pom Pom", mrp: 1250, discountPrice: 250, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988686/bwcrackers/bw-32-color-celebrate-5pcs.jpg" },
    { code: "154", title: "Colour Cone", mrp: 2500, discountPrice: 500, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988686/bwcrackers/bw-32-color-celebrate-5pcs.jpg" },
    { code: "155", title: "Yoogu Fountain", mrp: 3000, discountPrice: 600, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988684/bwcrackers/bw-31-white-house.jpg" },
    { code: "156", title: "Super Stick", mrp: 3000, discountPrice: 600, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988669/bwcrackers/bw-24-ultra-pencil-3pcs.jpg" },
    { code: "157", title: "Robo Kids (5 Pcs)", mrp: 1000, discountPrice: 200, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988681/bwcrackers/bw-29-emu-egg.jpg" },
    { code: "158", title: "8\" Fountain (1 Pce)", mrp: 1500, discountPrice: 300, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988684/bwcrackers/bw-31-white-house.jpg" },
    { code: "159", title: "Whizzling Wheel (5 Pcs)", mrp: 750, discountPrice: 150, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988648/bwcrackers/bw-12-24-deluxe.jpg" },
    { code: "160", title: "Ganga Yammuna (5 Pcs)", mrp: 500, discountPrice: 100, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988686/bwcrackers/bw-32-color-celebrate-5pcs.jpg" },
    { code: "161", title: "Cylinder", mrp: 750, discountPrice: 150, unit: "1 BOX", category: "Hi Fi Fancy Items", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988684/bwcrackers/bw-31-white-house.jpg" },
    { code: "FP1", title: "Family Pack ₹3500", mrp: 17500, discountPrice: 3500, unit: "1 BOX", category: "Diwali Special Combo Packs", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988688/bwcrackers/bw-157-sunrises-22-items.jpg" },
    { code: "FP2", title: "Family Pack ₹5000", mrp: 25000, discountPrice: 5000, unit: "1 BOX", category: "Diwali Special Combo Packs", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988689/bwcrackers/bw-158-royal-king-26-items.jpg" },
    { code: "FP3", title: "Family Pack ₹7500", mrp: 37500, discountPrice: 7500, unit: "1 BOX", category: "Diwali Special Combo Packs", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988692/bwcrackers/bw-160-chennai-super-kings-42-items.jpg" },
    { code: "FP4", title: "Family Pack ₹10000", mrp: 50000, discountPrice: 10000, unit: "1 BOX", category: "Diwali Special Combo Packs", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988693/bwcrackers/bw-161-andal-nachiyar-51-items.jpg" }
  ];

    const handle = (p: { code: string; title: string }) =>
    `bw-${String(p.code).toLowerCase()}-` +
    p.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  await createProductsWorkflow(container).run({
    input: {
      products: productsData.map((p) => ({
        title: p.title,
        category_ids: [catMap[p.category]],
        description: `${p.title} - ${p.category}. MRP: ₹${p.mrp}. Special 80% discount price: ₹${p.discountPrice}. Sold as ${p.unit}.`,
        handle: handle(p),
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
