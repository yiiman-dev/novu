import { ComponentProps, useState } from 'react';
import { RJSFSchema } from '@rjsf/utils';
import { RiArrowDownSLine, RiArrowUpSLine, RiInputField } from 'react-icons/ri';
import { type ControlsMetadata } from '@novu/shared';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/primitives/collapsible';
import { JsonForm } from './json-form';
import { WorkflowOriginEnum } from '@/utils/enums';
import { cn } from '@/utils/ui';

type CustomStepControlsProps = ComponentProps<typeof Collapsible> & {
  dataSchema: ControlsMetadata['dataSchema'];
  origin: WorkflowOriginEnum;
};
export const CustomStepControls = (props: CustomStepControlsProps) => {
  const { className, dataSchema, origin, ...rest } = props;
  const [isEditorOpen, setIsEditorOpen] = useState(true);

  if (!dataSchema?.properties || origin !== WorkflowOriginEnum.EXTERNAL) {
    return null;
  }

  return (
    <Collapsible
      open={isEditorOpen}
      onOpenChange={setIsEditorOpen}
      className={cn(
        'bg-neutral-alpha-50 border-neutral-alpha-200 flex w-full flex-col gap-2 rounded-lg border p-2 text-sm',
        className
      )}
      {...rest}
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between">
        <div className="flex items-center gap-1">
          <RiInputField className="text-feature size-5" />
          <span className="font-medium">Custom step controls</span>
        </div>

        {isEditorOpen ? (
          <RiArrowUpSLine className="text-neutral-alpha-400 size-5" />
        ) : (
          <RiArrowDownSLine className="text-neutral-alpha-400 size-5" />
        )}
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="bg-background rounded-md border border-dashed p-3">
          <JsonForm schema={(dataSchema as RJSFSchema) || {}} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
