import { Shield } from "lucide-react";
import { Card, CardContent } from "./Card";
import Button from "./Button";

export const SecurityAlert = ({ violations, onDismiss }) => {
  if (violations.length === 0) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto">
      <Card className="border-red-300 bg-red-50/90">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield  className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-red-800 font-semibold mb-2">Security Violation Detected</h4>
              {violations.map((violation, index) => (
                <p key={index} className="text-red-700 text-sm mb-1">
                  {violation}
                </p>
              ))}
              <Button 
                size="sm" 
                variant="danger" 
                onClick={onDismiss}
                className="mt-3"
              >
                I Understand
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};