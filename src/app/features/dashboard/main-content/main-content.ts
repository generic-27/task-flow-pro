import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-content',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main-content.html',
  styleUrl: './main-content.scss',
})
export class MainContent {
  quickStats = {
    totalTasks: 156,
    completedTasks: 89,
    inProgressTasks: 34,
    overdueTasks: 12,
  };

  recentActivities = [
    {
      id: 1,
      action: 'Task completed',
      description: 'User authentication implementation',
      time: '2 hours ago',
      user: 'John Doe',
    },
    {
      id: 2,
      action: 'New task created',
      description: 'Design system documentation',
      time: '4 hours ago',
      user: 'Jane Smith',
    },
    {
      id: 3,
      action: 'Task assigned',
      description: 'Database optimization',
      time: '6 hours ago',
      user: 'Mike Johnson',
    },
  ];

  createNewTask(): void {
    console.log('Creating new task...');
    // In a real app, this would open a create task modal or navigate to a form
  }

  generateReport(): void {
    console.log('Generating report...');
    // In a real app, this would trigger report generation
  }
}
