import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Tag } from "@medusajs/icons"
import { useEffect, useState } from "react"
import {
  Container,
  Heading,
  Table,
  Badge,
  Text,
  Button,
  Input,
  Switch,
  Label,
  toast,
} from "@medusajs/ui"

type Brand = {
  id: string
  name: string
  handle: string
  logo_url: string | null
  rank: number
  is_enabled: boolean
}

const BrandsPage = () => {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState("")
  const [newLogo, setNewLogo] = useState("")

  const fetchBrands = async () => {
    try {
      const res = await fetch("/admin/brands", { credentials: "include" })
      const data = await res.json()
      setBrands(data.brands || [])
    } catch (e) {
      console.error("Failed to fetch brands:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  const updateBrand = async (id: string, patch: Partial<Brand>) => {
    try {
      await fetch(`/admin/brands/${id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      })
      await fetchBrands()
    } catch (e) {
      toast.error("Failed to update brand")
    }
  }

  const deleteBrand = async (id: string) => {
    if (!confirm("Delete this brand?")) return
    try {
      await fetch(`/admin/brands/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      await fetchBrands()
    } catch (e) {
      toast.error("Failed to delete brand")
    }
  }

  const createBrand = async () => {
    if (!newName.trim()) {
      toast.error("Brand name is required")
      return
    }
    try {
      await fetch("/admin/brands", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          logo_url: newLogo.trim() || null,
          rank: brands.length,
          is_enabled: true,
        }),
      })
      setNewName("")
      setNewLogo("")
      await fetchBrands()
      toast.success("Brand added")
    } catch (e) {
      toast.error("Failed to add brand")
    }
  }

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= brands.length) return
    const a = brands[index]
    const b = brands[target]
    // swap ranks
    await Promise.all([
      updateBrandSilent(a.id, { rank: b.rank }),
      updateBrandSilent(b.id, { rank: a.rank }),
    ])
    await fetchBrands()
  }

  const updateBrandSilent = (id: string, patch: Partial<Brand>) =>
    fetch(`/admin/brands/${id}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })

  const enabledCount = brands.filter((b) => b.is_enabled).length

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Brands</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            Toggle which brands appear on the storefront "Our Brands" strip.
            {" "}
            {enabledCount} of {brands.length} shown.
          </Text>
        </div>
        <Button variant="secondary" size="small" onClick={fetchBrands}>
          Refresh
        </Button>
      </div>

      {/* Add new brand */}
      <div className="flex flex-wrap items-end gap-3 px-6 py-4 bg-ui-bg-subtle">
        <div className="flex flex-col gap-1">
          <Label size="xsmall">Brand name</Label>
          <Input
            placeholder="e.g. Anil"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-[240px]">
          <Label size="xsmall">Logo URL</Label>
          <Input
            placeholder="https://… or /brand1.png"
            value={newLogo}
            onChange={(e) => setNewLogo(e.target.value)}
          />
        </div>
        <Button onClick={createBrand}>Add brand</Button>
      </div>

      {loading ? (
        <div className="px-6 py-8">
          <Text>Loading…</Text>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Order</Table.HeaderCell>
              <Table.HeaderCell>Logo</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Logo URL</Table.HeaderCell>
              <Table.HeaderCell>Shown</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {brands.map((b, i) => (
              <Table.Row key={b.id}>
                <Table.Cell>
                  <div className="flex gap-1">
                    <Button
                      variant="transparent"
                      size="small"
                      disabled={i === 0}
                      onClick={() => move(i, -1)}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="transparent"
                      size="small"
                      disabled={i === brands.length - 1}
                      onClick={() => move(i, 1)}
                    >
                      ↓
                    </Button>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {b.logo_url ? (
                    <img
                      src={b.logo_url}
                      alt={b.name}
                      style={{ height: 32, width: 56, objectFit: "contain" }}
                    />
                  ) : (
                    <Badge size="2xsmall" color="grey">
                      none
                    </Badge>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Input
                    defaultValue={b.name}
                    onBlur={(e) => {
                      if (e.target.value !== b.name)
                        updateBrand(b.id, { name: e.target.value })
                    }}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Input
                    defaultValue={b.logo_url || ""}
                    onBlur={(e) => {
                      if (e.target.value !== (b.logo_url || ""))
                        updateBrand(b.id, { logo_url: e.target.value || null })
                    }}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Switch
                    checked={b.is_enabled}
                    onCheckedChange={(checked) =>
                      updateBrand(b.id, { is_enabled: checked })
                    }
                  />
                </Table.Cell>
                <Table.Cell>
                  <Button
                    variant="transparent"
                    size="small"
                    onClick={() => deleteBrand(b.id)}
                  >
                    Delete
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Brands",
  icon: Tag,
})

export default BrandsPage
