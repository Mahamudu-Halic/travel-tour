import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface PageNavigatorType {
  total: number;
  limit: number;
  page: number;
}

const PageNavigator = ({ total, limit, page }: PageNavigatorType) => {
  const totalPages = Math.ceil(total / limit);
  return (
    <div className="w-full flex items-center justify-between">
      <Pagination className="justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`?page=${page !== 1 ? page - 1 : page}`}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, index) => (
            <PaginationItem key={crypto.randomUUID()}>
              <PaginationLink
                href={`?page=${index + 1}`}
                isActive={page === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {/* <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem> */}
          <PaginationItem>
            <PaginationNext
              href={`?page=${page! < totalPages ? page + 1 : page}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PageNavigator;
