"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedDemoData;
const utils_1 = require("@medusajs/framework/utils");
const core_flows_1 = require("@medusajs/medusa/core-flows");
async function seedDemoData({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const link = container.resolve(utils_1.ContainerRegistrationKeys.LINK);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const fulfillmentModuleService = container.resolve(utils_1.Modules.FULFILLMENT);
    const salesChannelModuleService = container.resolve(utils_1.Modules.SALES_CHANNEL);
    const storeModuleService = container.resolve(utils_1.Modules.STORE);
    const countries = ["in"];
    logger.info("Seeding store data...");
    const [store] = await storeModuleService.listStores();
    let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
        name: "Default Sales Channel",
    });
    if (!defaultSalesChannel.length) {
        const { result: salesChannelResult } = await (0, core_flows_1.createSalesChannelsWorkflow)(container).run({
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
    });
    logger.info("Seeding region data...");
    const { result: regionResult } = await (0, core_flows_1.createRegionsWorkflow)(container).run({
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
    await (0, core_flows_1.createTaxRegionsWorkflow)(container).run({
        input: countries.map((country_code) => ({
            country_code,
            provider_id: "tp_system",
        })),
    });
    logger.info("Finished seeding tax regions.");
    logger.info("Seeding stock location data...");
    const { result: stockLocationResult } = await (0, core_flows_1.createStockLocationsWorkflow)(container).run({
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
    });
    await link.create({
        [utils_1.Modules.STOCK_LOCATION]: {
            stock_location_id: stockLocation.id,
        },
        [utils_1.Modules.FULFILLMENT]: {
            fulfillment_provider_id: "manual_manual",
        },
    });
    logger.info("Seeding fulfillment data...");
    const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
        type: "default",
    });
    let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;
    if (!shippingProfile) {
        const { result: shippingProfileResult } = await (0, core_flows_1.createShippingProfilesWorkflow)(container).run({
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
        [utils_1.Modules.STOCK_LOCATION]: {
            stock_location_id: stockLocation.id,
        },
        [utils_1.Modules.FULFILLMENT]: {
            fulfillment_set_id: fulfillmentSet.id,
        },
    });
    await (0, core_flows_1.createShippingOptionsWorkflow)(container).run({
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
    await (0, core_flows_1.linkSalesChannelsToStockLocationWorkflow)(container).run({
        input: {
            id: stockLocation.id,
            add: [defaultSalesChannel[0].id],
        },
    });
    logger.info("Finished seeding stock location data.");
    logger.info("Seeding publishable API key data...");
    const { result: publishableApiKeyResult } = await (0, core_flows_1.createApiKeysWorkflow)(container).run({
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
    await (0, core_flows_1.linkSalesChannelsToApiKeyWorkflow)(container).run({
        input: {
            id: publishableApiKey.id,
            add: [defaultSalesChannel[0].id],
        },
    });
    logger.info("Finished seeding publishable API key data.");
    logger.info("Seeding product categories...");
    const { result: categoryResult } = await (0, core_flows_1.createProductCategoriesWorkflow)(container).run({
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
    const catMap = Object.fromEntries(categoryResult.map((c) => [c.name, c.id]));
    logger.info("Seeding product data...");
    // Product data from Excel price list - images matched by visual analysis
    const productsData = [
        { code: "1", title: "2 3/4\" Kuruvi", mrp: 40, discountPrice: 8, unit: "1 PKT", category: "Single Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988630/bwcrackers/bw-1-2-3-4-kuruvi.jpg" },
        { code: "2", title: "3 1/2\" Lakshmi", mrp: 80, discountPrice: 16, unit: "1 PKT", category: "Single Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988643/bwcrackers/bw-3-4-lakshmi.jpg" },
        { code: "3", title: "4\" Lakshmi", mrp: 100, discountPrice: 20, unit: "1 PKT", category: "Single Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988643/bwcrackers/bw-3-4-lakshmi.jpg" },
        { code: "4", title: "4\" Deluxe Lakshmi", mrp: 150, discountPrice: 30, unit: "1 PKT", category: "Single Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988643/bwcrackers/bw-3-4-lakshmi.jpg" },
        { code: "5", title: "4\" Gold Lakshmi", mrp: 175, discountPrice: 35, unit: "1 PKT", category: "Single Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988643/bwcrackers/bw-3-4-lakshmi.jpg" },
        { code: "6", title: "5\" Mega Lakshmi", mrp: 190, discountPrice: 38, unit: "1 PKT", category: "Single Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988643/bwcrackers/bw-3-4-lakshmi.jpg" },
        { code: "7", title: "2 Sound Crackers", mrp: 175, discountPrice: 35, unit: "1 PKT", category: "Single Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988645/bwcrackers/bw-7-2-sound-crackers.jpg" },
        { code: "8", title: "Elephant Crackers", mrp: 250, discountPrice: 50, unit: "1 PKT", category: "Single Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988646/bwcrackers/bw-8-elephant-crackers.jpg" },
        { code: "9", title: "28 Chorsa", mrp: 70, discountPrice: 14, unit: "1 PKT", category: "Single Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988643/bwcrackers/bw-3-4-lakshmi.jpg" },
        { code: "10", title: "28 Giant", mrp: 120, discountPrice: 24, unit: "1 PKT", category: "Single Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988643/bwcrackers/bw-3-4-lakshmi.jpg" },
        { code: "11", title: "56 Giant", mrp: 200, discountPrice: 40, unit: "1 PKT", category: "Single Sound Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988643/bwcrackers/bw-3-4-lakshmi.jpg" },
        { code: "12", title: "24 Deluxe", mrp: 250, discountPrice: 50, unit: "1 PKT", category: "Deluxe Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988648/bwcrackers/bw-12-24-deluxe.jpg" },
        { code: "13", title: "50 Deluxe", mrp: 500, discountPrice: 100, unit: "1 PKT", category: "Deluxe Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988643/bwcrackers/bw-3-4-lakshmi.jpg" },
        { code: "14", title: "100 Deluxe", mrp: 1100, discountPrice: 220, unit: "1 PKT", category: "Deluxe Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988643/bwcrackers/bw-3-4-lakshmi.jpg" },
        { code: "15", title: "Red Bijili", mrp: 160, discountPrice: 32, unit: "1 PKT", category: "Bijili Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988650/bwcrackers/bw-15-red-bijili.jpg" },
        { code: "16", title: "Stripped Bijili", mrp: 170, discountPrice: 34, unit: "1 PKT", category: "Bijili Crackers", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988652/bwcrackers/bw-16-stripped-bijili.jpg" },
        { code: "17", title: "Baby Rocket", mrp: 300, discountPrice: 60, unit: "1 BOX", category: "Rockets", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988654/bwcrackers/bw-17-baby-rocket.jpg" },
        { code: "18", title: "Rocket Bomb", mrp: 450, discountPrice: 90, unit: "1 BOX", category: "Rockets", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988657/bwcrackers/bw-18-rocket-bomb.jpg" },
        { code: "19", title: "Lunik Rocket", mrp: 700, discountPrice: 140, unit: "1 BOX", category: "Rockets", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988659/bwcrackers/bw-19-lunik-rocket.jpg" },
        { code: "20", title: "Musical Rocket", mrp: 900, discountPrice: 180, unit: "1 BOX", category: "Rockets", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988662/bwcrackers/bw-20-musical-rocket.jpg" },
        { code: "21", title: "2 Sound Rocket", mrp: 1000, discountPrice: 200, unit: "1 BOX", category: "Rockets", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988664/bwcrackers/bw-21-2-sound-rocket.jpg" },
        { code: "22", title: "7\" Magic Pencil", mrp: 125, discountPrice: 25, unit: "1 BOX", category: "Candles", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988666/bwcrackers/bw-22-7-magic-pencil.jpg" },
        { code: "23", title: "12\" Pencil", mrp: 275, discountPrice: 55, unit: "1 BOX", category: "Candles", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988668/bwcrackers/bw-23-12-pencil.jpg" },
        { code: "24", title: "Ultra Pencil (3pcs)", mrp: 400, discountPrice: 80, unit: "1 BOX", category: "Color Pencil", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988669/bwcrackers/bw-24-ultra-pencil-3pcs.jpg" },
        { code: "25", title: "Navarag Pencil (5pcs)", mrp: 1000, discountPrice: 200, unit: "1 BOX", category: "Color Pencil", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988671/bwcrackers/bw-25-navarag-pencil-5pcs.jpg" },
        { code: "26", title: "Popcorn Pencil (5pcs)", mrp: 1200, discountPrice: 240, unit: "1 BOX", category: "Color Pencil", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988675/bwcrackers/bw-26-popcorn-pencil-5pcs.jpg" },
        { code: "27", title: "Selfie Stick (5pcs)", mrp: 1000, discountPrice: 200, unit: "1 BOX", category: "Color Pencil", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988677/bwcrackers/bw-27-selfie-stick-5pcs.jpg" },
        { code: "28", title: "Bat and Ball", mrp: 1400, discountPrice: 280, unit: "1 BOX", category: "Night Crackling Effects", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988679/bwcrackers/bw-28-bat-and-ball.jpg" },
        { code: "29", title: "Emu Egg", mrp: 1250, discountPrice: 250, unit: "1 BOX", category: "Night Crackling Effects", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988681/bwcrackers/bw-29-emu-egg.jpg" },
        { code: "30", title: "Tim Tam", mrp: 500, discountPrice: 100, unit: "1 BOX", category: "Night Crackling Effects", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988682/bwcrackers/bw-30-tim-tam.jpg" },
        { code: "31", title: "White House", mrp: 800, discountPrice: 160, unit: "1 BOX", category: "Night Crackling Effects", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988684/bwcrackers/bw-31-white-house.jpg" },
        { code: "32", title: "Color Celebrate (5pcs)", mrp: 1500, discountPrice: 300, unit: "1 BOX", category: "Night Crackling Effects", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988686/bwcrackers/bw-32-color-celebrate-5pcs.jpg" },
        { code: "157", title: "Sunrises (22 Items)", mrp: 1500, discountPrice: 300, unit: "1 BOX", category: "Premium Gift Boxes", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988688/bwcrackers/bw-157-sunrises-22-items.jpg" },
        { code: "158", title: "Royal King (26 Items)", mrp: 1900, discountPrice: 380, unit: "1 BOX", category: "Premium Gift Boxes", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988689/bwcrackers/bw-158-royal-king-26-items.jpg" },
        { code: "159", title: "Mumbai Indians (31 Items)", mrp: 2400, discountPrice: 480, unit: "1 BOX", category: "Premium Gift Boxes", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988691/bwcrackers/bw-159-mumbai-indians-31-items.jpg" },
        { code: "160", title: "Chennai Super Kings (42 Items)", mrp: 3500, discountPrice: 690, unit: "1 BOX", category: "Premium Gift Boxes", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988692/bwcrackers/bw-160-chennai-super-kings-42-items.jpg" },
        { code: "161", title: "Andal Nachiyar (51 Items)", mrp: 4500, discountPrice: 890, unit: "1 BOX", category: "Premium Gift Boxes", image: "https://res.cloudinary.com/dgkqsmgmy/image/upload/v1775988693/bwcrackers/bw-161-andal-nachiyar-51-items.jpg" }
    ];
    const handle = (title) => title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    await (0, core_flows_1.createProductsWorkflow)(container).run({
        input: {
            products: productsData.map((p) => ({
                title: p.title,
                category_ids: [catMap[p.category]],
                description: `${p.title} - ${p.category}. MRP: ₹${p.mrp}. Special 80% discount price: ₹${p.discountPrice}. Sold as ${p.unit}.`,
                handle: handle(p.title),
                weight: 500,
                status: utils_1.ProductStatus.PUBLISHED,
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
    const inventoryLevels = [];
    for (const inventoryItem of inventoryItems) {
        const inventoryLevel = {
            location_id: stockLocation.id,
            stocked_quantity: 1000000,
            inventory_item_id: inventoryItem.id,
        };
        inventoryLevels.push(inventoryLevel);
    }
    await (0, core_flows_1.createInventoryLevelsWorkflow)(container).run({
        input: {
            inventory_levels: inventoryLevels,
        },
    });
    logger.info("Finished seeding inventory levels data.");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL3NlZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFxQkEsK0JBbVlDO0FBdlpELHFEQUltQztBQUNuQyw0REFhcUM7QUFFdEIsS0FBSyxVQUFVLFlBQVksQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUNoRSxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0QsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqRSxNQUFNLHdCQUF3QixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3hFLE1BQU0seUJBQXlCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDM0UsTUFBTSxrQkFBa0IsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUU1RCxNQUFNLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXpCLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUNyQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN0RCxJQUFJLG1CQUFtQixHQUFHLE1BQU0seUJBQXlCLENBQUMsaUJBQWlCLENBQUM7UUFDMUUsSUFBSSxFQUFFLHVCQUF1QjtLQUM5QixDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDaEMsTUFBTSxFQUFF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