"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Layers, Sparkles, Shield } from "lucide-react";
import { UserManagement } from "./users/user-management";
import { CategoryManagement } from "./categories/category-management";
import { AiToolsManagement } from "./ai-tools/ai-tools-management";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-white/90 mt-1">
              Manage users, organize categories, and configure AI tools
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-14 bg-gray-100 rounded-xl p-1">
          <TabsTrigger
            value="users"
            className="flex items-center gap-3 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"
          >
            <div className="p-1.5 bg-purple-100 rounded-md">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            Users
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="flex items-center gap-3 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"
          >
            <div className="p-1.5 bg-green-100 rounded-md">
              <Layers className="h-4 w-4 text-green-600" />
            </div>
            Categories
          </TabsTrigger>
          <TabsTrigger
            value="ai-tools"
            className="flex items-center gap-3 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"
          >
            <div className="p-1.5 bg-blue-100 rounded-md">
              <Sparkles className="h-4 w-4 text-blue-600" />
            </div>
            AI Tools
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6 mt-0">
          <UserManagement />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6 mt-0">
          <CategoryManagement />
        </TabsContent>

        <TabsContent value="ai-tools" className="space-y-6 mt-0">
          <AiToolsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
