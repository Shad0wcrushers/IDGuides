
import { Category, DocPage, User } from "@/types/docs";
import { v4 as uuid } from "uuid";

// Mock users
export const mockUsers: User[] = [
  {
    id: uuid(),
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  },
  {
    id: uuid(),
    email: "user@example.com",
    name: "Regular User",
    role: "user",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
  },
];

// Mock categories
export const mockCategories: Category[] = [
  {
    id: "cat-1",
    title: "Getting Started",
    slug: "getting-started",
    order: 1,
    description: "Learn how to get started with our hosting services",
  },
  {
    id: "cat-2",
    title: "Minecraft Hosting",
    slug: "minecraft-hosting",
    order: 2,
    description: "Documentation for Minecraft server hosting",
  },
  {
    id: "cat-3",
    title: "Game Servers",
    slug: "game-servers",
    order: 3,
    description: "Documentation for various game server hosting options",
  },
  {
    id: "cat-4",
    title: "Account Management",
    slug: "account-management",
    order: 4,
    description: "Managing your account and billing information",
  },
  {
    id: "cat-5",
    title: "FAQ & Troubleshooting",
    slug: "faq-troubleshooting",
    order: 5,
    description: "Frequently asked questions and troubleshooting guides",
  },
];

// Mock pages
export const mockPages: DocPage[] = [
  {
    id: "page-1",
    title: "Welcome to Our Hosting Documentation",
    slug: "welcome",
    content: `
# Welcome to Our Hosting Documentation

Thank you for choosing our hosting services. This documentation will help you get started with our platform and make the most of your hosting experience.

## What We Offer

Our hosting platform provides a wide range of services:

- Game server hosting for popular games
- Web hosting with excellent performance
- VPS solutions for your custom needs
- Dedicated servers for maximum power

## Getting Support

If you need help with any aspect of our services, you can:

1. Browse through this documentation
2. Contact our support team via live chat
3. Submit a support ticket through your control panel
4. Join our community Discord server

We're here to help you succeed with your projects!
    `,
    categoryId: "cat-1",
    order: 1,
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 0, 15).toISOString(),
    publishedAt: new Date(2023, 0, 15).toISOString(),
    excerpt: "Get started with our hosting documentation",
    author: "Admin User",
    views: 0
  },
  {
    id: "page-2",
    title: "Setting Up Your First Server",
    slug: "setting-up-first-server",
    content: `
# Setting Up Your First Server

This guide will walk you through the process of setting up your first server on our platform.

## Step 1: Choose Your Plan

Start by selecting the appropriate hosting plan for your needs. Consider:
- Expected number of users
- Resource requirements (RAM, CPU, storage)
- Budget constraints

## Step 2: Server Configuration

After purchasing a plan, you'll need to configure your server:
1. Log in to your control panel
2. Navigate to "Server Management"
3. Click "Create New Server"
4. Select your desired configuration options
5. Click "Deploy Server"

## Step 3: Access Your Server

Once deployed, you can access your server through:
- SSH (for VPS/dedicated servers)
- Control panel interface
- FTP for file uploads
- Game-specific control panels for game servers

## Next Steps

After setting up your server, you might want to:
- Configure automatic backups
- Set up monitoring alerts
- Configure domains (if applicable)
- Install additional software
    `,
    categoryId: "cat-1",
    order: 2,
    createdAt: new Date(2023, 0, 16).toISOString(),
    updatedAt: new Date(2023, 1, 10).toISOString(),
    publishedAt: new Date(2023, 1, 10).toISOString(),
    excerpt: "Learn how to setup your first server",
    author: "Admin User",
    views: 0
  },
  {
    id: "page-3",
    title: "Minecraft Server Setup Guide",
    slug: "minecraft-server-setup",
    content: `
# Minecraft Server Setup Guide

Setting up a Minecraft server with our hosting service is quick and easy. Follow this guide to get your server up and running.

## Prerequisites
- An active hosting account
- A purchased Minecraft server plan
- Basic knowledge of Minecraft server management

## Installation Process

1. **Log in to your control panel**
   Access your hosting control panel using your account credentials.

2. **Navigate to Minecraft services**
   Find the Minecraft section in your dashboard.

3. **Select server type**
   Choose between:
   - Vanilla Minecraft
   - Spigot
   - Paper
   - Forge
   - Fabric
   - Modded servers (FTB, etc.)

4. **Configure server settings**
   - Server name
   - Server version
   - Allocated RAM
   - Initial world settings

5. **Start your server**
   Click the "Start" button to initialize your Minecraft server.

## Accessing Your Server

After your server starts, you can:
- Connect via the Minecraft client using your server IP
- Access server files via FTP
- Manage plugins and mods through the control panel
- Monitor performance in real time

## Common Configuration Options

### server.properties
\`\`\`properties
difficulty=normal
pvp=true
max-players=20
spawn-protection=16
\`\`\`

### Memory Allocation
We recommend allocating at least 4GB RAM for a standard Minecraft server with 5-10 players.
    `,
    categoryId: "cat-2",
    order: 1,
    createdAt: new Date(2023, 1, 5).toISOString(),
    updatedAt: new Date(2023, 3, 12).toISOString(),
    publishedAt: new Date(2023, 1, 8).toISOString(),
    excerpt: "Complete guide for setting up a Minecraft server",
    author: "Admin User",
    views: 0
  },
  {
    id: "page-4",
    title: "Managing Your Billing Information",
    slug: "managing-billing",
    content: `
# Managing Your Billing Information

This guide will help you manage your billing information, payment methods, and subscriptions.

## Accessing Billing Information

1. Log in to your account dashboard
2. Navigate to the "Account" section
3. Click on "Billing" in the sidebar

## Payment Methods

### Adding a Payment Method
1. Go to "Payment Methods"
2. Click "Add Payment Method"
3. Choose between credit card, PayPal, or cryptocurrency
4. Enter your payment details
5. Click "Save"

### Setting a Default Payment Method
1. From the Payment Methods page, find your preferred method
2. Click "Set as Default"

## Managing Subscriptions

### Viewing Active Subscriptions
All your active subscriptions appear on the "Subscriptions" tab.

### Canceling a Subscription
1. Locate the subscription you wish to cancel
2. Click "Manage"
3. Select "Cancel Subscription"
4. Follow the prompts to confirm cancellation

Note that canceling a subscription does not provide an immediate refund and your service will continue until the end of your billing period.

## Invoices and Payment History

Your complete payment history is available under the "Invoices" tab.

For each transaction you can:
- View detailed invoice information
- Download PDF invoices
- View payment status

## Billing Cycles

Our services typically bill on a monthly cycle. The specific renewal date is visible on each subscription detail page.

## Need Help?

If you encounter any issues with billing or payments, please contact our support team through:
- Live chat
- Email: billing@example.com
- Support ticket
    `,
    categoryId: "cat-4",
    order: 1,
    createdAt: new Date(2023, 2, 10).toISOString(),
    updatedAt: new Date(2023, 2, 10).toISOString(),
    publishedAt: new Date(2023, 2, 12).toISOString(),
    excerpt: "Learn how to manage your billing information and subscriptions",
    author: "Admin User",
    views: 0
  },
];
