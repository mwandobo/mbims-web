Remaining Tasks

Hosting
Pagination & searching
form and popup style refactor
dashboard data population
reports
user change password
user otp verification
populate select in edit







// Sample data structure for API responses
const dashboardData = {
stats: {
totalContracts: 124,
activeContracts: 89,
expiringSoon: 15,
totalLicenses: 76,
activeLicenses: 62,
expiredLicenses: 8,
suppliers: 42,
clients: 58,
departments: 12
},
contractTypes: [
{ type: 'Supplier Contracts', value: 68 },
{ type: 'Client Contracts', value: 56 },
],
licenseStatus: [
{ status: 'Active', value: 62 },
{ status: 'Expired', value: 8 },
{ status: 'Pending Renewal', value: 6 },
],
expirationTimeline: [
{ month: 'Jan', contracts: 3, licenses: 2 },
// ... more months
],
departmentDistribution: [
{ department: 'Finance', contracts: 28, licenses: 12 },
// ... more departments
],
recentActivities: [
{ id: 1, type: 'Contract', action: 'Renewed', entity: 'ABC Corp', date: '2023-06-15', user: 'John Doe' },
// ... more activities
]
};



// DashboardController.ts
import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
constructor(private readonly dashboardService: DashboardService) {}

@Get('stats')
async getDashboardStats() {
return this.dashboardService.getStats();
}

@Get('contract-types')
async getContractTypes() {
return this.dashboardService.getContractTypes();
}

@Get('license-status')
async getLicenseStatus() {
return this.dashboardService.getLicenseStatus();
}

@Get('expiration-timeline')
async getExpirationTimeline() {
return this.dashboardService.getExpirationTimeline();
}

@Get('department-distribution')
async getDepartmentDistribution() {
return this.dashboardService.getDepartmentDistribution();
}

@Get('recent-activities')
async getRecentActivities() {
return this.dashboardService.getRecentActivities();
}
}