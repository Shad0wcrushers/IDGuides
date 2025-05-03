
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useDocsContext } from "../../context/DocsContext";

const SettingsAdmin = () => {
  const { resetAllViews } = useDocsContext();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Documentation Settings</CardTitle>
            <CardDescription>
              Configure general settings for your documentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Site Information</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  These settings are currently managed in the code. In a production 
                  environment, these would be editable here.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Backup & Export</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Export your documentation for backup or migration purposes.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline">Export Content</Button>
                  <Button variant="outline">Export Settings</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions that affect your entire documentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Purge Content</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This will permanently delete all pages and categories. This action cannot be undone.
                </p>
                <Button variant="destructive">Reset Documentation</Button>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Reset All Views</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This will reset the view count for all documentation pages to zero.
                </p>
                <Button variant="outline" onClick={resetAllViews}>
                  Reset All Views
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsAdmin;
