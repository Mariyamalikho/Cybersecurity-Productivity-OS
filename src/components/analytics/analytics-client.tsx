"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function AnalyticsClient({ data }: { data: any[] }) {
  return (
    <div className="max-w-6xl mx-auto space-y-8 mt-8">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight mb-2">Performance Analytics</h1>
        <p className="text-muted-foreground">Visualize your progress and output over the last 30 days.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* XP Velocity Chart */}
        <Card className="border-border/40 bg-card/50">
          <CardHeader>
            <CardTitle>XP Velocity (Estimated)</CardTitle>
            <CardDescription>Daily Experience Points earned over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#eab308' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="estimatedXp" 
                  name="XP Earned"
                  stroke="#eab308" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#eab308', stroke: '#09090b', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Productivity Chart */}
        <Card className="border-border/40 bg-card/50">
          <CardHeader>
            <CardTitle>Output Volume</CardTitle>
            <CardDescription>Tasks and Habits completed per day.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="tasks" name="Tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="habits" name="Habits" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
