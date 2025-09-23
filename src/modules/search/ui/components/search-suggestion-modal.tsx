import { cn } from "@/lib/utils";
import { Loader2Icon, SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SearchSuggestionsType {
  id: string;
  title: string;
  thumbnailUrl: string | null;
}

interface SearchSuggestionModalProps {
  open: boolean;
  searchSuggestions: SearchSuggestionsType[];
  isLoading: boolean;
}

const SearchSuggestionModal = ({
  open,
  searchSuggestions,
  isLoading,
}: SearchSuggestionModalProps) => {



  return (
    <div className={cn("absolute flex flex-col gap-2 border rounded-2xl p-2 top-14 left-0 w-full max-h-100 overflow-y-auto bg-white shadow-md", open ? "block" : "hidden")}>
      {isLoading && (
        <div className="w-full p-3 flex justify-center items-center">
          <Loader2Icon className="animate-spin size-4"/>
        </div>
      )}
      {!isLoading && searchSuggestions && (
        searchSuggestions.map((searchSuggestion) => (
          <Link href={`/search?query=${searchSuggestion.title}`} key={searchSuggestion.id}>
            <div className="flex justify-between items-center h-10 px-2 py-2 hover:bg-gray-200 rounded-md">
              <div className="flex gap-1 items-center justify-center">
              <SearchIcon className="text-gray-500 size-4" />
              {searchSuggestion.title}
              </div>
              <div className="overflow-hidden rounded">
                {searchSuggestion.thumbnailUrl && (<Image src={searchSuggestion.thumbnailUrl} alt="" width={60} height={20} className="object-cover"/>)}
              </div>
            </div>
          </Link>
        ))
      )}
      {!isLoading && searchSuggestions.length <= 0 && (<div className="w-full p-2">No suggestions</div>)}
    </div>
  )
}

export default SearchSuggestionModal;