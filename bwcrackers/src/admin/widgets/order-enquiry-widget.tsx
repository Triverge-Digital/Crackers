import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Badge,
  Button,
  Container,
  Heading,
  Input,
  Select,
  Table,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"

type EnquiryItem = {
  code?: string
  title: string
  quantity: number
  unit_price: number
  variant_title?: string | null
}

type OrderEnquiry = {
  id: string
  reference: string
  customer_name: string
  phone: string
  email: string | null
  address: string | null
  city: string | null
  state: string | null
  pincode: string | null
  notes: string | null
  items: EnquiryItem[]
  subtotal: number
  packing_fee: number
  grand_total: number
  currency_code: string
  status: string
  tracking_number: string | null
  admin_notes: string | null
  created_at: string
  updated_at: string
}

const STATUSES = [
  "pending",
  "confirmed",
  "paid",
  "packed",
  "dispatched",
  "delivered",
  "cancelled",
] as const

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  paid: "Paid",
  packed: "Packed",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
}

type BadgeColor = "green" | "red" | "blue" | "orange" | "grey" | "purple"

const STATUS_COLOR: Record<string, BadgeColor> = {
  pending: "orange",
  confirmed: "blue",
  paid: "purple",
  packed: "purple",
  dispatched: "blue",
  delivered: "green",
  cancelled: "red",
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })

const inr = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0)

const waLink = (phone: string) => `https://wa.me/${phone.replace(/[^\d]/g, "")}`

const OrderEnquiryWidget = () => {
  const [enquiries, setEnquiries] = useState<OrderEnquiry[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<OrderEnquiry | null>(null)

  const fetchEnquiries = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ limit: "200" })
      if (statusFilter !== "all") params.set("status", statusFilter)
      const response = await fetch(`/admin/order-enquiry?${params}`, { credentials: "include" })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      setEnquiries(data.order_enquiries || [])
      setCount(data.count ?? data.order_enquiries?.length ?? 0)
    } catch (err) {
      console.error("Failed to fetch enquiries:", err)
      setError("Could not load order enquiries. Refresh to try again.")
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchEnquiries()
  }, [fetchEnquiries])

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return enquiries
    return enquiries.filter(
      (e) =>
        e.reference.toLowerCase().includes(q) ||
        e.customer_name.toLowerCase().includes(q) ||
        e.phone.includes(q) ||
        (e.city ?? "").toLowerCase().includes(q)
    )
  }, [enquiries, search])

  const totals = useMemo(() => {
    const open = enquiries.filter((e) => !["delivered", "cancelled"].includes(e.status))
    return {
      open: open.length,
      openValue: open.reduce((s, e) => s + (e.grand_total || e.subtotal), 0),
    }
  }, [enquiries])

  const saveEnquiry = async (
    id: string,
    patch: { status?: string; tracking_number?: string | null; admin_notes?: string | null }
  ) => {
    const response = await fetch(`/admin/order-enquiry/${id}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data?.message || `HTTP ${response.status}`)
    const updated: OrderEnquiry = data.order_enquiry
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)))
    setSelected((prev) => (prev && prev.id === id ? { ...prev, ...updated } : prev))
    return updated
  }

  if (selected) {
    return (
      <EnquiryDetail
        enquiry={selected}
        onBack={() => setSelected(null)}
        onSave={saveEnquiry}
      />
    )
  }

  return (
    <Container className="p-0 divide-y">
      <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-4">
        <div>
          <Heading level="h2">Order Enquiries</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            Orders placed from the storefront. Payment is collected manually — confirm on
            WhatsApp, then move the status along as you pack and dispatch.
          </Text>
        </div>
        <div className="flex gap-2">
          <Badge color="orange">{totals.open} open</Badge>
          <Badge color="grey">{inr(totals.openValue)} open value</Badge>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 px-6 py-3">
        <div className="w-44">
          <Select value={statusFilter} onValueChange={setStatusFilter} size="small">
            <Select.Trigger>
              <Select.Value placeholder="All statuses" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">All statuses</Select.Item>
              {STATUSES.map((s) => (
                <Select.Item key={s} value={s}>
                  {STATUS_LABEL[s]}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
        <div className="w-64">
          <Input
            size="small"
            placeholder="Search reference, name, phone, city"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="secondary" size="small" onClick={fetchEnquiries} disabled={loading}>
          Refresh
        </Button>
        <Text size="small" className="text-ui-fg-subtle ml-auto">
          Showing {visible.length} of {count}
        </Text>
      </div>

      {error ? (
        <div className="px-6 py-8">
          <Text className="text-ui-fg-error">{error}</Text>
        </div>
      ) : loading && enquiries.length === 0 ? (
        <div className="px-6 py-8">
          <Text className="text-ui-fg-subtle">Loading order enquiries…</Text>
        </div>
      ) : visible.length === 0 ? (
        <div className="px-6 py-8">
          <Text className="text-ui-fg-subtle">
            {enquiries.length === 0 ? "No enquiries yet." : "No enquiries match this filter."}
          </Text>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Ref</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Customer</Table.HeaderCell>
              <Table.HeaderCell>Phone</Table.HeaderCell>
              <Table.HeaderCell>City</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Items</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Total</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {visible.map((e) => (
              <Table.Row
                key={e.id}
                className="cursor-pointer hover:bg-ui-bg-base-hover"
                onClick={() => setSelected(e)}
              >
                <Table.Cell className="font-mono text-xs">#{e.reference}</Table.Cell>
                <Table.Cell>{formatDate(e.created_at)}</Table.Cell>
                <Table.Cell className="font-medium">{e.customer_name}</Table.Cell>
                <Table.Cell>{e.phone}</Table.Cell>
                <Table.Cell>{e.city || "—"}</Table.Cell>
                <Table.Cell className="text-right">{e.items?.length || 0}</Table.Cell>
                <Table.Cell className="text-right">{inr(e.grand_total || e.subtotal)}</Table.Cell>
                <Table.Cell>
                  <Badge color={STATUS_COLOR[e.status] ?? "grey"} size="xsmall">
                    {STATUS_LABEL[e.status] ?? e.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={(ev) => {
                      ev.stopPropagation()
                      setSelected(e)
                    }}
                  >
                    View
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

type DetailProps = {
  enquiry: OrderEnquiry
  onBack: () => void
  onSave: (
    id: string,
    patch: { status?: string; tracking_number?: string | null; admin_notes?: string | null }
  ) => Promise<OrderEnquiry>
}

const EnquiryDetail = ({ enquiry, onBack, onSave }: DetailProps) => {
  const [status, setStatus] = useState(enquiry.status)
  const [tracking, setTracking] = useState(enquiry.tracking_number ?? "")
  const [adminNotes, setAdminNotes] = useState(enquiry.admin_notes ?? "")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setStatus(enquiry.status)
    setTracking(enquiry.tracking_number ?? "")
    setAdminNotes(enquiry.admin_notes ?? "")
  }, [enquiry.id, enquiry.status, enquiry.tracking_number, enquiry.admin_notes])

  const dirty =
    status !== enquiry.status ||
    tracking !== (enquiry.tracking_number ?? "") ||
    adminNotes !== (enquiry.admin_notes ?? "")

  const save = async () => {
    setSaving(true)
    try {
      await onSave(enquiry.id, {
        status,
        tracking_number: tracking.trim() || null,
        admin_notes: adminNotes.trim() || null,
      })
      toast.success("Enquiry updated", { description: `#${enquiry.reference} is now ${STATUS_LABEL[status]}.` })
    } catch (err) {
      toast.error("Could not update enquiry", {
        description: err instanceof Error ? err.message : "Unknown error",
      })
    } finally {
      setSaving(false)
    }
  }

  const address =
    [enquiry.address, enquiry.city, enquiry.state, enquiry.pincode].filter(Boolean).join(", ") || "—"
  const packingFee = enquiry.packing_fee ?? 0
  const grandTotal = enquiry.grand_total || enquiry.subtotal + packingFee

  return (
    <Container className="p-0 divide-y">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div className="flex items-center gap-3">
          <Heading level="h2">Order #{enquiry.reference}</Heading>
          <Badge color={STATUS_COLOR[enquiry.status] ?? "grey"}>
            {STATUS_LABEL[enquiry.status] ?? enquiry.status}
          </Badge>
        </div>
        <div className="flex gap-2">
          <a href={waLink(enquiry.phone)} target="_blank" rel="noreferrer">
            <Button variant="secondary" size="small">
              WhatsApp customer
            </Button>
          </a>
          <Button variant="secondary" size="small" onClick={onBack}>
            Back to list
          </Button>
        </div>
      </div>

      <div className="grid gap-6 px-6 py-4 md:grid-cols-3">
        <div className="space-y-3">
          <Field label="Customer" value={enquiry.customer_name} />
          <Field label="Phone" value={enquiry.phone} />
          <Field label="Email" value={enquiry.email || "—"} />
          <Field label="Placed" value={formatDate(enquiry.created_at)} />
          <Field label="Last updated" value={formatDate(enquiry.updated_at)} />
        </div>
        <div className="space-y-3">
          <Field label="Delivery address" value={address} />
          <Field label="Customer notes" value={enquiry.notes || "—"} />
        </div>
        <div className="space-y-3 rounded-lg border p-4">
          <Text size="small" weight="plus">
            Update order
          </Text>
          <div>
            <Text size="xsmall" className="text-ui-fg-subtle mb-1">
              Status
            </Text>
            <Select value={status} onValueChange={setStatus} size="small">
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {STATUSES.map((s) => (
                  <Select.Item key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
          <div>
            <Text size="xsmall" className="text-ui-fg-subtle mb-1">
              Courier / tracking number
            </Text>
            <Input
              size="small"
              value={tracking}
              placeholder="e.g. ST Courier 123456789"
              onChange={(e) => setTracking(e.target.value)}
            />
          </div>
          <div>
            <Text size="xsmall" className="text-ui-fg-subtle mb-1">
              Internal notes (not shown to customer)
            </Text>
            <Textarea
              rows={3}
              value={adminNotes}
              placeholder="Payment received via GPay, packed by…"
              onChange={(e) => setAdminNotes(e.target.value)}
            />
          </div>
          <Button size="small" onClick={save} disabled={!dirty || saving} isLoading={saving}>
            Save changes
          </Button>
        </div>
      </div>

      <div className="px-6 py-4">
        <Heading level="h3" className="mb-3">
          Items ({enquiry.items.length})
        </Heading>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Code</Table.HeaderCell>
              <Table.HeaderCell>Product</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Qty</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Unit</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Total</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {enquiry.items.map((item, idx) => (
              <Table.Row key={idx}>
                <Table.Cell className="font-mono text-xs">{item.code || "—"}</Table.Cell>
                <Table.Cell>
                  {item.title}
                  {item.variant_title ? (
                    <span className="text-ui-fg-subtle ml-1 text-xs">({item.variant_title})</span>
                  ) : null}
                </Table.Cell>
                <Table.Cell className="text-right">{item.quantity}</Table.Cell>
                <Table.Cell className="text-right">{inr(item.unit_price)}</Table.Cell>
                <Table.Cell className="text-right">{inr(item.unit_price * item.quantity)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        <div className="ml-auto mt-4 w-full max-w-xs space-y-1 text-sm">
          <div className="flex justify-between">
            <Text size="small" className="text-ui-fg-subtle">
              Items total
            </Text>
            <Text size="small">{inr(enquiry.subtotal)}</Text>
          </div>
          <div className="flex justify-between">
            <Text size="small" className="text-ui-fg-subtle">
              Packing &amp; handling (2%)
            </Text>
            <Text size="small">{inr(packingFee)}</Text>
          </div>
          <div className="flex justify-between border-t pt-2">
            <Text weight="plus">Grand total</Text>
            <Text weight="plus">{inr(grandTotal)}</Text>
          </div>
        </div>
      </div>
    </Container>
  )
}

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <Text size="xsmall" className="text-ui-fg-subtle">
      {label}
    </Text>
    <Text size="small" weight="plus" className="whitespace-pre-wrap">
      {value}
    </Text>
  </div>
)

export const config = defineWidgetConfig({
  zone: "order.list.before",
})

export default OrderEnquiryWidget
