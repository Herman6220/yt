
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import React from "react";

interface SubscriptionButtonProps{
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled: boolean;
    isSubscribed: boolean;
    className?: string;
    size?: "default" | "sm" | "lg" | "icon"; 
}

export const SubscriptionButton = ({
    onClick,
    disabled,
    isSubscribed,
    className,
    size,
}: SubscriptionButtonProps) => {
    return (
        <Button
            size={size ?? "default"}
            variant={isSubscribed ? "secondary" : "default"}
            className={cn("rounded-full", className)}
            onClick={onClick}
            disabled={disabled}
        >
            {isSubscribed ? "Unsubscribe": "Subscribe"}
        </Button>
    )
}