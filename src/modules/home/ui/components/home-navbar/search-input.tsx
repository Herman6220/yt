"use client"

import { Button } from "@/components/ui/button";
import { APP_URL, DEFAULT_SEARCH_LIMIT } from "@/constants";
import SearchSuggestionModal from "@/modules/search/ui/components/search-suggestion-modal";
import { trpc } from "@/trpc/client";
import { Loader2Icon, SearchIcon, XIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";



export const SearchInput = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const [value, setValue] = useState(query);
    const [isSearchSuggestionModalOpen, setIsSearchSuggestionModalOpen] = useState(false);
    const [debouncedValue] = useDebounce(value, 500);
    const searchSuggestionRef = useRef<HTMLDivElement | null>(null);


    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault();

        const url = new URL("/search", APP_URL);
        const newQuery = value.trim();

        url.searchParams.set("query", encodeURIComponent(newQuery));

        if (categoryId) {
            url.searchParams.set("categoryId", categoryId);
        }

        if (newQuery === "") {
            url.searchParams.delete("query");
        }

        setValue(newQuery);
        router.push(url.toString());
    }


    const { data: searchSuggestions, isLoading } = trpc.search.getManySearchSuggestion.useQuery({
        query: debouncedValue,
        limit: DEFAULT_SEARCH_LIMIT,
    }, {
        enabled: debouncedValue.length > 0,
    })

    useEffect(() => {
        if(value){
            setIsSearchSuggestionModalOpen(true);
        }else{
            setIsSearchSuggestionModalOpen(false);
        }
    }, [value])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if(searchSuggestionRef.current && !searchSuggestionRef.current.contains(event.target as Node)){
                setIsSearchSuggestionModalOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return() => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])


    return (
        <div className="w-full max-w-[600px] relative">
            <form className="flex w-full max-w-[600px]" onSubmit={handleSearch}>
                <div className="relative w-full" ref={searchSuggestionRef}>
                    <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onFocus={() => setIsSearchSuggestionModalOpen(true)}
                        type="text"
                        placeholder="search"
                        className="w-full pl-4 py-2 pr-12 rounded-l-full border focus:outline-none focus:border-blue-500"
                    />
                    {value && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setValue("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                        >
                            {isLoading ? (<Loader2Icon className="text-gray-500 animate-spin"/>) : (<XIcon className="text-gray-500" />)}
                        </Button>
                    )}
                    <SearchSuggestionModal open={isSearchSuggestionModalOpen} searchSuggestions={searchSuggestions ?? []} isLoading={isLoading}/>
                </div>
                <button
                    disabled={!value.trim()}
                    type="submit"
                    className="px-5 py-2.5 bg-gray-100 border border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <SearchIcon className="size-5" />
                </button>
            </form>
        </div>
    )
}