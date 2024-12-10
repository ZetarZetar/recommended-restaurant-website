import { useState } from "react";
import { FilterForm } from "@/components/FilterForm";
import { ResultsTable } from "@/components/ResultsTable";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Ensure you have a button component

const ITEMS_PER_PAGE = 10;

const Index = () => {
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(true); // State to toggle filter visibility
  const { toast } = useToast();

  const handleSubmit = async (filters: any) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://recommended-restaurant-1-0.onrender.com/api/restaurants/filter",
        // "http://localhost:8080/api/restaurants/filter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filters),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch restaurants");
      }

      const data = await response.json();
      setResults(data);
      setCurrentPage(1);

      if (data.length > 0) {
        toast({
          title: "Success",
          description: `Found ${data.length} restaurants matching your criteria.`,
        });
      } else {
        toast({
          title: "No Results",
          description: "No restaurants found matching your criteria.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch restaurants. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const paginatedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Restaurant Finder
        </h1>

        {/* Toggle Button for Filter Form */}
        <div className="flex justify-start mb-4">
          <Button
            onClick={() => setShowFilter(!showFilter)}
            className="bg-primary text-white px-4 py-2 rounded-md"
          >
            {showFilter ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Filter Form */}
        {showFilter && (
          <div className="mb-8">
            <FilterForm onSubmit={handleSubmit} />
          </div>
        )}

        {/* Results Table */}
        <Card className="p-8">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : results.length > 0 ? (
            <ResultsTable
              data={paginatedResults}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              totalPages={Math.ceil(results.length / ITEMS_PER_PAGE)}
            />
          ) : (
            <div className="text-center text-gray-500">No results to display</div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Index;
