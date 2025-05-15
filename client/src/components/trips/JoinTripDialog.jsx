import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Loader2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  tripCode: z.string()
    .min(8, 'Trip code must be 8 characters')
    .max(8, 'Trip code must be 8 characters')
    .regex(/^[A-Z0-9]+$/, 'Trip code contains invalid characters'),
});

export function JoinTripDialog({ open, onOpenChange, onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tripCode: '',
    },
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values.tripCode);
      form.reset();
      toast.success(`Successfully joined trip "${response.data.name}"!`)
    } catch (error) {
      console.error('Error joining trip:', error);
      const errorMessage = error.response?.data?.error || 'Failed to join trip';
      toast.error(`Failed to join trip: ${errorMessage}`)
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format input to uppercase
  const handleInputChange = (e, field) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    field.onChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="mr-2 h-5 w-5" />
            Join Trip
          </DialogTitle>
          <DialogDescription>
            Enter the trip code shared by your friend to join their trip.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="tripCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trip Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., ABC12345"
                      className="text-center text-lg font-mono tracking-wider"
                      maxLength={8}
                      {...field}
                      onChange={(e) => handleInputChange(e, field)}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground mt-1">
                    Trip codes are 8 characters long and contain only letters and numbers.
                  </p>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Join Trip
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}