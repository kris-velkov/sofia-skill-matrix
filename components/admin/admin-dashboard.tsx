"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Layers,
  Sparkles,
  Shield,
  Briefcase,
  UserCheck,
  Zap,
} from "lucide-react";
import { UserManagement } from "./users/user-management";
import { CategoryManagement } from "./categories/category-management";
import { AiToolsManagement } from "./ai-tools/ai-tools-management";
import { RolesManagement } from "./roles/roles-management";
import { ProgramsManagement } from "./programs/programs-management";
import { SkillsManagement } from "./skills/skills-management";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8 text-white">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-white/90 mt-1 text-sm sm:text-base">
              Manage users, organize categories, and configure AI tools
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-6 lg:mb-8 h-auto sm:h-14 bg-gray-100 rounded-xl p-1 gap-1 sm:gap-0">
          <TabsTrigger
            value="users"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all p-2 sm:p-3"
          >
            <div className="p-1 sm:p-1.5 bg-purple-100 rounded-md">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
            </div>
            <span className="hidden xs:inline sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger
            value="programs"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all p-2 sm:p-3"
          >
            <div className="p-1 sm:p-1.5 bg-orange-100 rounded-md">
              <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
            </div>
            <span className="hidden xs:inline sm:inline">Programs</span>
          </TabsTrigger>
          <TabsTrigger
            value="roles"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all p-2 sm:p-3"
          >
            <div className="p-1 sm:p-1.5 bg-indigo-100 rounded-md">
              <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600" />
            </div>
            <span className="hidden xs:inline sm:inline">Roles</span>
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all p-2 sm:p-3"
          >
            <div className="p-1 sm:p-1.5 bg-green-100 rounded-md">
              <Layers className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            </div>
            <span className="hidden xs:inline sm:inline">Categories</span>
          </TabsTrigger>
          <TabsTrigger
            value="skills"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all p-2 sm:p-3"
          >
            <div className="p-1 sm:p-1.5 bg-purple-100 rounded-md">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
            </div>
            <span className="hidden xs:inline sm:inline">Skills</span>
          </TabsTrigger>
          <TabsTrigger
            value="ai-tools"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all p-2 sm:p-3"
          >
            <div className="p-1 sm:p-1.5 bg-blue-100 rounded-md">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
            </div>
            <span className="hidden xs:inline sm:inline">AI Tools</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4 sm:space-y-6 mt-0">
          <UserManagement />
        </TabsContent>

        <TabsContent value="programs" className="space-y-4 sm:space-y-6 mt-0">
          <ProgramsManagement />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4 sm:space-y-6 mt-0">
          <RolesManagement />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4 sm:space-y-6 mt-0">
          <CategoryManagement />
        </TabsContent>

        <TabsContent value="skills" className="space-y-4 sm:space-y-6 mt-0">
          <SkillsManagement />
        </TabsContent>

        <TabsContent value="ai-tools" className="space-y-4 sm:space-y-6 mt-0">
          <AiToolsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
