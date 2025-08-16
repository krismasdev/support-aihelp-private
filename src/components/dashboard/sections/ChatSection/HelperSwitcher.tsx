import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Loader2 } from 'lucide-react';

export function HelperSwitcher({
  helpers,
  activeHelper,
  onSwitch,
  selectingHelperId,
  helperIcons,
}: {
  helpers: any[];
  activeHelper: any;
  onSwitch: (helper: any) => void;
  selectingHelperId: string | null;
  helperIcons: Record<string, string>;
}) {
  return (
    <div className='rounded-lg border bg-background shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-200 p-4 mt-6'>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-medium text-indigo-900">Quick Switch Helper:</h3>
        <Badge variant="secondary" className="text-xs">
          {helpers.length} available
        </Badge>
      </div>
      <div className="flex gap-2 flex-wrap">
        {helpers.map((helper) => (
          <Button
            key={helper.id}
            size="sm"
            variant={activeHelper?.id === helper.id ? "default" : "outline"}
            onClick={() => onSwitch(helper)}
            disabled={!!selectingHelperId}
            className={`flex items-center gap-1 h-9 text-sm px-3 w-fit py-1 transition-all ${activeHelper?.id === helper.id
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md border-2 border-indigo-600'
              : 'hover:bg-indigo-50 border-indigo-200 hover:border-indigo-300'
              }`}
          >
            <span className="text-md">
              {selectingHelperId === helper.id ? (
                <Loader2 className="animate-spin" />
              ) : (
                helperIcons[helper.type] || '🤖'
              )}
            </span>
            <span className="text-md font-medium text-center leading-tight">{helper.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}