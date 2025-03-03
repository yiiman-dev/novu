import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider } from 'react-hook-form';

import { cn } from '@/utils/ui';
import { Label } from '@/components/primitives/label';
import { cva } from 'class-variance-authority';
import { FormFieldContext, FormItemContext, useFormField } from './form-context';
import { RiErrorWarningFill, RiInformationFill } from 'react-icons/ri';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/primitives/tooltip';

const Form = FormProvider;

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn('space-y-1', className)} {...props} />
      </FormItemContext.Provider>
    );
  }
);
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { optional?: boolean; hint?: string; tooltip?: string }
>(({ className, optional, tooltip, hint, children, ...props }, ref) => {
  const { formItemId } = useFormField();

  return (
    <Label ref={ref} className={cn('text-foreground-950 flex items-center', className)} htmlFor={formItemId} {...props}>
      {children}

      {tooltip && (
        <Tooltip>
          <TooltipTrigger className="ml-1" type="button">
            <BsFillInfoCircleFill className="text-foreground-300 -mt-0.5 inline size-3" />
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      )}

      {hint && <span className="text-foreground-400 ml-0.5 inline-flex items-center gap-1">{hint}</span>}

      {optional && <span className="text-foreground-400 ml-0.5 inline-flex items-center gap-1">(optional)</span>}
    </Label>
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(
  ({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
        aria-invalid={!!error}
        {...props}
      />
    );
  }
);
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return (
      <p ref={ref} id={formDescriptionId} className={cn('text-muted-foreground text-[0.8rem]', className)} {...props} />
    );
  }
);
FormDescription.displayName = 'FormDescription';

const formMessageVariants = cva('flex items-center gap-1', {
  variants: {
    variant: {
      default: '[&>svg]:text-foreground-400 text-foreground-500',
      error: '[&>svg]:text-destructive [&>span]:text-destructive',
    },
  },
});

const FormMessagePure = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { error?: string }
>(({ className, children, error, id, ...props }, ref) => {
  const body = error ? error : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={id}
      className={formMessageVariants({ variant: error ? 'error' : 'default', className })}
      {...props}
    >
      <span>{error ? <RiErrorWarningFill className="size-4" /> : <RiInformationFill className="size-4" />}</span>
      <span className="mt-[1px] text-xs leading-4">{body}</span>
    </p>
  );
});
FormMessagePure.displayName = 'FormMessagePure';

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>((props, ref) => {
  const { error, formMessageId } = useFormField();

  return <FormMessagePure ref={ref} id={formMessageId} error={error ? String(error?.message) : undefined} {...props} />;
});
FormMessage.displayName = 'FormMessage';

export { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormMessagePure, FormField };
