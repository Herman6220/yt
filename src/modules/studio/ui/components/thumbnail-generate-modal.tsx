import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ThumbnailGenerateModalProps {
    videoId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}




export const ThumbnailGenerateModal = ({
    videoId,
    open,
    onOpenChange,
}: ThumbnailGenerateModalProps) => {

    const formSchema = z.object({
        prompt: z.string().min(10),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
        }
    })


    const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
        onSuccess: () => {
            toast.success("Background job started", { description: "This may take some time" });
            form.reset();
            onOpenChange(false);
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        generateThumbnail.mutate({
            prompt: values.prompt,
            id: videoId,
        })
    }

    return (
        <ResponsiveModal
            title="Upload a thumbnail"
            open={open}
            onOpenChange={onOpenChange}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 p-4 pb-8"
                >
                    <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prompt</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        className="resize-none"
                                        cols={30}
                                        rows={5}
                                        placeholder="A description of the thumbnail wanted"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button
                            disabled={generateThumbnail.isPending}
                            type="submit"
                        >
                            Generate
                        </Button>
                    </div>
                </form>
            </Form>
        </ResponsiveModal>
    )
}
