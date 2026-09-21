import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("../../../src/config.js", () => ({
  config: { PICNIC_SAFE_CART_ONLY: true, PICNIC_COUNTRY_CODE: "DE" },
}))

describe("PICNIC_SAFE_CART_ONLY tool exposure", () => {
  beforeEach(() => vi.resetModules())

  it("exposes only read-only and cart mutation tools", async () => {
    await import("../../../src/tools/picnic-tools.js")
    const { toolRegistry } = await import("../../../src/tools/registry.js")
    const names = toolRegistry.getToolsList().map((tool) => tool.name)

    expect(names).toEqual(expect.arrayContaining([
      "picnic_search", "picnic_get_cart", "picnic_add_to_cart",
      "picnic_remove_from_cart", "picnic_clear_cart", "picnic_add_recipe_to_cart",
      "picnic_remove_recipe_from_cart", "picnic_get_delivery_slots",
    ]))
    expect(names).not.toEqual(expect.arrayContaining([
      "picnic_set_delivery_slot", "picnic_cancel_delivery", "picnic_rate_delivery",
      "picnic_send_delivery_invoice_email", "picnic_save_recipe", "picnic_unsave_recipe",
      "picnic_generate_2fa_code", "picnic_verify_2fa_code",
    ]))
    expect(names.some((name) => /checkout|place.*order|payment.*(?:set|update|change)/i.test(name))).toBe(false)
  })
})
