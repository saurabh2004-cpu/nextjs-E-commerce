'use client'
import axiosInstance from '@/app/(frontend)/services/api';
import { reviewSchema } from '@/schemas/reviewAndRatingSchema';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { number, z } from 'zod';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Loader2, Star } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '../ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ListAllReviews from './ListAllReviews';

interface PostReviewAndRatingsProps {
    productId: string;
}

const PostReviewAndRatings: React.FC<PostReviewAndRatingsProps> = ({ productId }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rating, setRating] = useState(0);
    const { toast } = useToast();  // Destructure the toast function correctly
    const queryClient = useQueryClient()


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

    const postReviewAndRating = async (comment:string) => {
        const response = await axiosInstance.post(`/api/post-review?productId=${productId}`, {
            comment: comment,
            rating: rating,
        });

        // console.log("post review res",response)
        form.reset({ rating: 0, comment: '' });
        setRating(0);

        return response

    }

    const { mutate, isError, isPending, variables } = useMutation({
        mutationFn: postReviewAndRating,

        onSuccess: async () => {
            // console.log('Success:', response.data);
            toast({
                title: "Review Posted",
                description: "Your review was successfully posted. Thank you for your feedback!",
                variant: "default",
            });

            console.log("pending state on sucess",isPending)

        },
        onError: (error) => {
            console.error('Error:', error);
            toast({
                title: "Cannot Post Review",
                description: "Unexpected response from server.",
                variant: "destructive",
            });

        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['review'] }),
        mutationKey: ['addReview'],
    })

    console.log("var",variables)

    const onSubmit = async (data: z.infer<typeof reviewSchema>) => {

        if (!data.rating || !data.comment) {
            toast({
                title: "Missing Information",
                description: "Please provide both a rating and a comment.",
                variant: "destructive",
            });
            return;
        }

        mutate(data.comment)

        console.log("pending or not ",isPending)
    };


    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
        form.setValue("rating", newRating); // Update the form value for rating
    };

    if(isError) return <p>{isError}</p>


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
