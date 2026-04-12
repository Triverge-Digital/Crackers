import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEffect, useState } from "react"
import { Container, Heading, Table, Badge, Text, Button } from "@medusajs/ui"

type OrderEnquiry = {
  id: string
  customer_name: string
  phone: string
  email: string | null
  address: string | null
  city: string | null
  state: string | null
  pincode: string | null
  notes: string | null
  items: Array<{
    title: string
    quantity: number
    unit_price: number
    variant_title?: string
  }>
  subtotal: number
  currency_code: string
  status: string
  created_at: string
}

const OrderEnquiryWidget = () => {
  const [enquiries, setEnquiries] = useState<OrderEnquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEnquiry, setSelectedEnquiry] = useState<OrderEnquiry | null>(
    null
  )

  const fetchEnquiries = async () => {
    try {
      const response = await fetch("/admin/order-enquiry", {
        credentials: "include",
      })
      const data = await response.json()
      setEnquiries(data.order_enquiries || [])
    } catch (error) {
      console.error("Failed to fetch enquiries:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/admin/order-enquiry/${id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      fetchEnquiries()
      setSelectedEnquiry(null)
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    })
  }

  const formatCurrency = (amount: number, code: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: code.toUpperCase(),
    }).format(amount)
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange"
      case "contacted":
        return "blue"
      case "confirmed":
        return "green"
      case "cancelled":
        return "red"
      default:
        return "grey"
    }
  }

  if (loading) {
    return (
      <Container className="p-8">
        <Text>Loading order enquiries...</Text>
      </Container>
    )
  }

  if (selectedEnquiry) {
    return (
      <Container className="p-8">
        <div className="flex items-center justify-between mb-6">
          <Heading level="h2">
            Enquiry from {selectedEnquiry.customer_name}
          </Heading>
          <Button variant="secondary" onClick={() => setSelectedEnquiry(null)}>
            Back to list
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <div>
              <Text className="text-ui-fg-subtle text-sm">Name</Text>
              <Text className="font-medium">
                {selectedEnquiry.customer_name}
              </Text>
            </div>
            <div>
              <Text className="text-ui-fg-subtle text-sm">Phone</Text>
              <Text className="font-medium">{selectedEnquiry.phone}</Text>
            </div>
            <div>
              <Text className="text-ui-fg-subtle text-sm">Email</Text>
              <Text className="font-medium">
                {selectedEnquiry.email || "—"}
              </Text>
            </div>
            <div>
              <Text className="text-ui-fg-subtle text-sm">Date</Text>
              <Text className="font-medium">
                {formatDate(selectedEnquiry.created_at)}
              </Text>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <Text className="text-ui-fg-subtle text-sm">Address</Text>
              <Text className="font-medium">
                {[
                  selectedEnquiry.address,
                  selectedEnquiry.city,
                  selectedEnquiry.state,
                  selectedEnquiry.pincode,
                ]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </Text>
            </div>
            <div>
              <Text className="text-ui-fg-subtle text-sm">Notes</Text>
              <Text className="font-medium">
                {selectedEnquiry.notes || "—"}
              </Text>
            </div>
            <div>
              <Text className="text-ui-fg-subtle text-sm">Status</Text>
              <Badge color={statusColor(selectedEnquiry.status)}>
                {selectedEnquiry.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        <Heading level="h3" className="mb-4">
          Items
        </Heading>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Product</Table.HeaderCell>
              <Table.HeaderCell>Qty</Table.HeaderCell>
              <Table.HeaderCell>Unit Price</Table.HeaderCell>
              <Table.HeaderCell>Total</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {selectedEnquiry.items.map((item, idx) => (
              <Table.Row key={idx}>
                <Table.Cell>
                  {item.title}
                  {item.variant_title && (
                    <span className="text-ui-fg-subtle text-sm ml-1">
                      ({item.variant_title})
                    </span>
                  )}
                </Table.Cell>
                <Table.Cell>{item.quantity}</Table.Cell>
                <Table.Cell>
                  {formatCurrency(
                    item.unit_price,
                    selectedEnquiry.currency_code
                  )}
                </Table.Cell>
                <Table.Cell>
                  {formatCurrency(
                    item.unit_price * item.quantity,
                    selectedEnquiry.currency_code
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <Text className="font-bold text-lg">
            Total:{" "}
            {formatCurrency(
              selectedEnquiry.subtotal,
              selectedEnquiry.currency_code
            )}
          </Text>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => updateStatus(selectedEnquiry.id, "contacted")}
            >
              Mark Contacted
            </Button>
            <Button onClick={() => updateStatus(selectedEnquiry.id, "confirmed")}>
              Confirm Order
            </Button>
            <Button
              variant="danger"
              onClick={() => updateStatus(selectedEnquiry.id, "cancelled")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading level="h2">Order Enquiries</Heading>
          <Text className="text-ui-fg-subtle mt-1">
            Customer enquiries placed from the storefront. No payment was
            collected.
          </Text>
        </div>
        <Badge>{enquiries.length} total</Badge>
      </div>

      {enquiries.length === 0 ? (
        <Text className="text-ui-fg-subtle">No enquiries yet.</Text>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Customer</Table.HeaderCell>
              <Table.HeaderCell>Phone</Table.HeaderCell>
              <Table.HeaderCell>Items</Table.HeaderCell>
              <Table.HeaderCell>Total</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {enquiries.map((e) => (
              <Table.Row
                key={e.id}
                className="cursor-pointer hover:bg-ui-bg-base-hover"
                onClick={() => setSelectedEnquiry(e)}
              >
                <Table.Cell>{formatDate(e.created_at)}</Table.Cell>
                <Table.Cell className="font-medium">
                  {e.customer_name}
                </Table.Cell>
                <Table.Cell>{e.phone}</Table.Cell>
                <Table.Cell>{e.items?.length || 0} items</Table.Cell>
                <Table.Cell>
                  {formatCurrency(e.subtotal, e.currency_code)}
                </Table.Cell>
                <Table.Cell>
                  <Badge color={statusColor(e.status)}>
                    {e.status.toUpperCase()}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={(ev) => {
                      ev.stopPropagation()
                      setSelectedEnquiry(e)
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

export const config = defineWidgetConfig({
  zone: "order.list.before",
})

export default OrderEnquiryWidget
