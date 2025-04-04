import ProductCard from "@/components/shared/product/product-card";
import {
  getAllCategories,
  getAllProducts,
} from "@/lib/actions/product.actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    sort?: string;
    rating?: string;
    page?: string;
  }>;
}

const SearchPage = async ({ searchParams }: Props) => {
  const {
    q = "all",
    category = "all",
    price = "all",
    sort = "newest",
    rating = "all",
    page = "1",
  } = await searchParams;

  // construct filter url -  utility function
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, sort, rating, page };
    if (c) {
      params.category = c;
    }

    if (s) {
      params.sort = s;
    }

    if (p) {
      params.price = p;
    }

    if (r) {
      params.rating = r;
    }

    if (pg) {
      params.page = pg;
    }

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const products = await getAllProducts({
    query: q,
    page: parseInt(page),
    category: category,
    price,
    sort,
    rating,
  });

  const categories = await getAllCategories();

  const prices = [
    {
      name: "Any",
      value: "all",
    },
    {
      name: "₹2000 to ₹5000",
      value: "2000-5000",
    },

    {
      name: "₹5000 to ₹10000",
      value: "5000-10000",
    },
    {
      name: "₹10000 to ₹20000",
      value: "10000-20000",
    },
    {
      name: "₹20000 to ₹50000",
      value: "20000-50000",
    },
    {
      name: "₹50000 and above",
      value: "50000-100000",
    },
  ];

  const ratings = [4, 3, 2, 1];

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links ">
        {/* category filter */}

        <div className="text-xl mb-2 mt-3">Department</div>
        <div>
          <ul className="space-y-1 list-none text-sm">
            <li>
              <Link
                className={category === "all" ? "text-blue-500" : ""}
                href={getFilterUrl({ c: "all" })}
              >
                Any
              </Link>
            </li>

            {categories.map((c) => (
              <li key={c.category}>
                <Link
                  className={c.category === category ? "text-blue-500" : ""}
                  href={getFilterUrl({ c: c.category })}
                >
                  {c.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* price filter */}
        <div className="text-xl  mb-2 mt-12">Price</div>

        <ul className="space-y-1 list-none text-sm">
          {prices.map((p) => (
            <li key={p.value}>
              <Link
                className={p.value === price ? "text-blue-500" : ""}
                href={getFilterUrl({ p: p.value })}
              >
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="text-xl  mb-2 mt-12">Rating</div>

        <ul className="space-y-1 list-none text-sm">
          <li>
            <Link
              className={`${rating === "all" && "font-bold"}`}
              href={getFilterUrl({ p: "all" })}
            >
              Any
            </Link>
          </li>

          {ratings.map((r) => (
            <li key={r}>
              <Link
                className={rating === r.toString() ? "text-blue-500" : ""}
                href={getFilterUrl({ r: `${r}` })}
              >
                {`${r} starts & up`}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4 md:col-span-4">
        <div className={"flex flex-between"}>
          <div>
            {q !== "all" && q !== "" && "Query: " + q}
            {category !== "all" && category !== "" && "Category: " + category}
            {price !== "all" && price !== "" && "Price: " + price}

            {rating !== "all" && rating !== "" && "Rating: " + rating}

            {/*  clear all filters*/}
            {(q !== "" && q !== "all") ||
              (category !== "all" && category !== "") ||
              (rating !== "all" && rating !== "" && (
                <Link href="/search">
                  <Button className={"ml-2"} variant={"outline"} size={"sm"}>
                    Clear
                  </Button>
                </Link>
              ))}
          </div>

          {/*  sorting */}
          <div className="flex gap-2.5">
            {["Highest", "Lowest"].map((s, index) => (
              <Link
                className={`${s.toLowerCase() === sort && "font-bold"}`}
                key={index}
                href={getFilterUrl({ s: s.toLowerCase() })}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && <div>No Products found</div>}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
