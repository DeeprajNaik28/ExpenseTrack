import { categories } from "../utils/categories";

function SearchFilter({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
}) {

  return (
    <div className="bg-slate-800 rounded-2xl p-4 mb-6 space-y-4">

      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full p-3 rounded-xl bg-slate-700 text-white outline-none"
      />

      <select
        value={selectedCategory}
        onChange={(e) =>
          setSelectedCategory(e.target.value)
        }
        className="w-full p-3 rounded-xl bg-slate-700 text-white outline-none"
      >

        <option value="All">
          All Categories
        </option>

        {categories.map((cat) => (
          <option
            key={cat.name}
            value={cat.name}
          >
            {cat.icon} {cat.name}
          </option>
        ))}

      </select>

    </div>
  );
}

export default SearchFilter;