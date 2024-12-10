import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useState, useEffect } from "react";

interface Restaurant {
  restaurant_name: string;
  restaurant_type: string;
  food_type: string;
  restaurant_nationality: string;
  clean_min_budget: number;
  clean_max_budget: number;
  district: string;
  carbohydrates: string;
  protein: string;
  fat: string;
}

interface ResultsTableProps {
  data: Restaurant[];
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}

export const ResultsTable = ({
  data,
  currentPage,
  onPageChange,
  totalPages,
}: ResultsTableProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const paginationLimit = 5; // Maximum pages to show on small screens

  // Detect if the screen size is mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    // Initial check
    handleResize();

    // Listen for screen size changes
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPaginationPages = () => {
    if (totalPages <= paginationLimit) {
      return Array.from({ length: totalPages }, (_, i) => i + 1); // Show all pages if totalPages is small
    }

    if (currentPage <= paginationLimit - 1) {
      return Array.from({ length: paginationLimit }, (_, i) => i + 1); // Show first few pages
    }

    if (currentPage > totalPages - paginationLimit) {
      return Array.from({ length: paginationLimit }, (_, i) => totalPages - paginationLimit + i + 1); // Show last few pages
    }

    // Show a subset of pages centered around the current page
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ].filter(page => page > 0 && page <= totalPages);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <div className="min-w-full max-w-full">
          <Table className="table-auto w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Restaurant Name</TableHead>
                <TableHead>Food Type</TableHead>
                <TableHead>Restaurant Type</TableHead>
                <TableHead>Food Nationality</TableHead>
                <TableHead>Min Budget (฿)</TableHead>
                <TableHead>Max Budget (฿)</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Carbohydrate</TableHead>
                <TableHead>Protein</TableHead>
                <TableHead>Fat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((restaurant, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {restaurant.restaurant_name}
                  </TableCell>
                  <TableCell>{restaurant.food_type}</TableCell>
                  <TableCell>{restaurant.restaurant_type}</TableCell>
                  <TableCell>{restaurant.restaurant_nationality}</TableCell>
                  <TableCell>{restaurant.clean_min_budget}</TableCell>
                  <TableCell>{restaurant.clean_max_budget}</TableCell>
                  <TableCell>{restaurant.district}</TableCell>
                  <TableCell>{restaurant.carbohydrates}</TableCell>
                  <TableCell>{restaurant.protein}</TableCell>
                  <TableCell>{restaurant.fat}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Pagination>
        <PaginationContent>
          {/* Show only the first and previous buttons on mobile */}
          {(
            <>
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                >
                  {"<<"}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                >
                  {"<"}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {/* Conditionally render page links */}
          {getPaginationPages().map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Show only the next and last buttons on mobile */}
          {(
            <>
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                >
                  {">"}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(totalPages)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                >
                  {">>"}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>

      {/* Show total pages below pagination */}
      <div className="text-center mt-4 text-sm">
        <span>Page {currentPage} of {totalPages}</span>
      </div>
    </div>
  );
};
