import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/services/api.services';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="p-6 bg-slate-50 min-h-screen">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-800">Hospital Intelligence</h1>
          <p class="text-slate-500">Real-time clinical and operational analytics</p>
        </div>
        <div class="flex gap-3">
           <button class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
             <i class="fas fa-download"></i> Export Report
           </button>
           <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-md active:scale-95">
             <i class="fas fa-sync"></i> Refresh Data
           </button>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:border-indigo-200 transition-all cursor-default">
          <div class="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <i class="fas fa-users"></i>
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Patients</p>
            <h3 class="text-2xl font-bold text-slate-800">{{stats?.totalPatients || 0}}</h3>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:border-emerald-200 transition-all cursor-default">
          <div class="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 text-xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <i class="fas fa-calendar-check"></i>
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Apps</p>
            <h3 class="text-2xl font-bold text-slate-800">{{stats?.todayAppointments || 0}}</h3>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:border-amber-200 transition-all cursor-default">
          <div class="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 text-xl group-hover:bg-amber-600 group-hover:text-white transition-all">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Revenue</p>
            <h3 class="text-2xl font-bold text-slate-800">{{stats?.monthlyRevenue | currency}}</h3>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:border-rose-200 transition-all cursor-default">
          <div class="w-14 h-14 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 text-xl group-hover:bg-rose-600 group-hover:text-white transition-all">
            <i class="fas fa-bed"></i>
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Stock Alerts</p>
            <h3 class="text-2xl font-bold text-slate-800 text-rose-600">{{stats?.lowStockItems || 0}}</h3>
          </div>
        </div>
      </div>

      <!-- Clinical KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl shadow-xl text-white">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-1">Avg Length of Stay (ALOS)</p>
          <div class="flex items-end gap-2">
            <h3 class="text-3xl font-black">{{stats?.clinicalKpis?.avgLengthOfStay || 0}}</h3>
            <span class="text-xs font-bold text-indigo-300 mb-1">Days</span>
          </div>
          <p class="text-[10px] mt-2 text-indigo-100/60">Target: < 4.5 Days</p>
        </div>
        
        <div class="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-2xl shadow-xl text-white">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-purple-200 mb-1">Readmission Rate (30d)</p>
          <div class="flex items-end gap-2">
            <h3 class="text-3xl font-black">{{stats?.clinicalKpis?.readmissionRate || 0}}%</h3>
          </div>
          <p class="text-[10px] mt-2 text-purple-100/60">Benchmark: 11.2%</p>
        </div>

        <div class="bg-gradient-to-br from-rose-600 to-rose-800 p-6 rounded-2xl shadow-xl text-white">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-rose-200 mb-1">Gross Mortality Rate</p>
          <div class="flex items-end gap-2">
            <h3 class="text-3xl font-black">{{stats?.clinicalKpis?.mortalityRate || 0}}%</h3>
          </div>
          <p class="text-[10px] mt-2 text-rose-100/60">Quality Goal: < 1.5%</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Revenue Chart Mock -->
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-slate-800">Financial Performance</h3>
            <select class="text-sm bg-slate-50 border-none rounded-lg px-2 py-1 outline-none text-slate-500">
              <option>Last 6 Months</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div class="h-64 flex items-end justify-between gap-4 px-2">
            <div *ngFor="let m of stats?.monthlyPerformance" class="flex-1 group relative">
              <div class="w-full bg-slate-100 rounded-lg relative overflow-hidden h-full">
                 <div class="absolute bottom-0 w-full bg-indigo-500 transition-all duration-700 rounded-t-lg group-hover:bg-indigo-600" 
                      [style.height.%]="(m.revenue / 50000) * 100"></div>
                 <div class="absolute bottom-0 w-full bg-rose-300 opacity-40 transition-all duration-700" 
                      [style.height.%]="(m.expenses / 50000) * 100"></div>
              </div>
              <p class="text-center text-[10px] font-bold text-slate-400 mt-3 truncate">{{m.month}}</p>
              
              <!-- Tooltip -->
              <div class="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] p-2 rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10 whitespace-nowrap shadow-xl">
                Rev: {{m.revenue | currency}}<br>
                Exp: {{m.expenses | currency}}
              </div>
            </div>
          </div>
          <div class="flex justify-center gap-6 mt-8">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 bg-indigo-500 rounded-full"></span>
              <span class="text-xs font-medium text-slate-600">Revenue</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 bg-rose-300 rounded-full"></span>
              <span class="text-xs font-medium text-slate-600">Expenses</span>
            </div>
          </div>
        </div>

        <!-- Occupancy -->
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
           <h3 class="text-lg font-bold text-slate-800 mb-6">Ward Occupancy</h3>
           <div class="space-y-6">
              <div *ngFor="let w of stats?.wardOccupancy" class="relative">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-semibold text-slate-700">{{w.wardName}}</span>
                  <span class="text-xs font-bold" [class]="w.occupancyPercentage > 85 ? 'text-rose-600' : 'text-slate-500'">{{w.occupiedBeds}}/{{w.totalBeds}} Beds</span>
                </div>
                <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full transition-all duration-1000 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                       [class]="w.occupancyPercentage > 85 ? 'bg-rose-500' : w.occupancyPercentage > 50 ? 'bg-indigo-500' : 'bg-emerald-500'"
                       [style.width.%]="w.occupancyPercentage"></div>
                </div>
              </div>
              
              <div *ngIf="!stats?.wardOccupancy?.length" class="text-center py-12 text-slate-400">
                <i class="fas fa-chart-pie text-4xl mb-3 opacity-20"></i>
                <p>No ward data available</p>
              </div>
           </div>
        </div>
      </div>
      
      <!-- Recent Activity Section -->
      <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
           <h3 class="text-lg font-bold text-slate-800 mb-6">Recent System Activity</h3>
           <div class="overflow-x-auto">
             <table class="w-full text-left">
               <thead>
                 <tr class="text-slate-400 text-xs uppercase tracking-widest border-b border-slate-50">
                   <th class="pb-4 font-semibold">Entity</th>
                   <th class="pb-4 font-semibold">Description</th>
                   <th class="pb-4 font-semibold">Time</th>
                 </tr>
               </thead>
               <tbody class="divide-y divide-slate-50">
                 <tr *ngFor="let a of stats?.recentActivities" class="group hover:bg-slate-50/50 transition-colors">
                   <td class="py-4">
                     <span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase" 
                           [class.bg-blue-50]="a.type === 'Patient'" [class.text-blue-600]="a.type === 'Patient'"
                           [class.bg-purple-50]="a.type !== 'Patient'" [class.text-purple-600]="a.type !== 'Patient'">{{a.type}}</span>
                   </td>
                   <td class="py-4 text-sm text-slate-600">{{a.description}}</td>
                   <td class="py-4 text-xs text-slate-400">{{a.date | date:'shortTime'}}</td>
                 </tr>
               </tbody>
             </table>
           </div>
        </div>
        
        <div class="bg-indigo-900 rounded-3xl shadow-xl p-8 text-white flex flex-col justify-between overflow-hidden relative">
           <div class="absolute top-0 right-0 p-8 opacity-10 blur-2xl pointer-events-none">
              <i class="fas fa-brain text-[200px]"></i>
           </div>
           <div>
             <h3 class="text-xl font-bold mb-2">Predictive Insights</h3>
             <p class="text-indigo-200 text-sm leading-relaxed">Based on current trends, occupancy is expected to reach 92% in Ward A over the next 48 hours.</p>
           </div>
           <div class="mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
              <p class="text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-2">Recommendation</p>
              <p class="text-sm font-medium">Coordinate with Discharge Planning to expedite 4 clearable cases in Ward A.</p>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class InsightsComponent implements OnInit {
  stats: any;

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.analyticsService.getExecutiveDashboard().subscribe(res => {
      this.stats = res;
    });
  }
}
