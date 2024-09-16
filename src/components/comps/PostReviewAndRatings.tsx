'use client'
import axiosInstance from '@/app/(frontend)/services/api';
import { reviewSchema } from '@/schemas/reviewAndRatingSchema';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Loader2, Star } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useToast } from '../ui/use-toast';

interface PostReviewAndRatingsProps{
    productId:string;
}

const PostReviewAndRatings: React.FC<PostReviewAndRatingsProps> = ({ productId }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rating, setRating] = useState(0);
    const router = useRouter();
    const { toast } = useToast();  // Destructure the toast function correctly

    if (!productId) {
        console.error("Product ID not found");
    }

    const form = useForm<z.infer<typeof reviewSchema>>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            comment: ''
        },
    });

    const onSubmit = async (data: z.infer<typeof reviewSchema>) => {

        if (!data.rating || !data.comment) {
            toast({
                title: "Missing Information",
                description: "Please provide both a rating and a comment.",
                variant: "destructive",
            });
            return;
        }
        
        setIsSubmitting(true);
        try {
            
            const response = await axiosInstance.post(`/api/post-review?productId=${productId}`, {
                rating: data.rating,
                comment: data.comment
            });

            if (response.status === 200) {
                toast({
                    title: "Review Posted",
                    description: "Your review was successfully posted. Thank you for your feedback!",
                    variant: "default",
                });
                form.reset({ rating: 0, comment: '' });
                setRating(0);
                router.refresh();  
            }

            toast({
                title: "Cannot Post Review",
                description: "Unexpected response from server.",
                variant: "destructive",
            });

        } catch (error) {
            // console.error("Error while posting the review", error);
            toast({
                title: "Cannot Post Review",
                description: "You need to purchase this product before posting a review.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
        form.setValue("rating", newRating); // Update the form value for rating
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Post Your Review</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Rating Field */}
                    <FormField
                        name="rating"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rating</FormLabel>
                                <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-6 w-6 cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-300'
                                                }`}
                                            onClick={() => handleRatingChange(star)}
                                        />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Comment Field */}
                    <FormField
                        name="comment"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Comment</FormLabel>
                                <Textarea
                                    placeholder="Write your review here..."
                                    className="h-24"
                                    {...field}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                        ) : (
                            'Post Review'
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default PostReviewAndRatings;
