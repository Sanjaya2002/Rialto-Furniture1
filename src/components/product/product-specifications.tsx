import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductSpecificationsProps {
  specifications: Record<string, string>;
}

export default function ProductSpecifications({
  specifications,
}: ProductSpecificationsProps) {
  if (!specifications || Object.keys(specifications).length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-serif font-bold text-luxury-black mb-6">
        Specifications
      </h2>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gold/10">
              <TableHead className="w-1/2 font-semibold text-luxury-black">
                Feature
              </TableHead>
              <TableHead className="font-semibold text-luxury-black">
                Detail
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(specifications).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className="font-medium capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
