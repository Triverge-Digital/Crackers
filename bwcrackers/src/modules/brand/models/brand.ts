import { model } from "@medusajs/framework/utils"

const Brand = model.define("brand", {
  id: model.id().primaryKey(),
  name: model.text(),
  handle: model.text(),
  logo_url: model.text().nullable(),
  rank: model.number().default(0),
  is_enabled: model.boolean().default(true),
})

export default Brand
