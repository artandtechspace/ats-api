import i18next from 'i18next';

import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
	{
		id: 'applications',
		title: 'Applications',
		translate: 'APPLICATIONS',
		type: 'group',
		icon: 'apps',
		children: [
			{
				id: 'dashboards',
				title: 'Dashboards',
				translate: 'DASHBOARDS',
				type: 'collapse',
				icon: 'dashboard',
				children: [
					{
						id: 'analytics-dashboard',
						title: 'Analytics',
						type: 'item',
						url: '/apps/dashboards/analytics'
					},
					{
						id: 'project-dashboard',
						title: 'Project',
						type: 'item',
						url: '/apps/dashboards/project'
					}
				]
			},
			{
				id: 'calendar',
				title: 'Calendar',
				translate: 'CALENDAR',
				type: 'item',
				icon: 'today',
				url: '/apps/calendar'
			},
			{
				id: 'e-commerce',
				title: 'E-Commerce',
				translate: 'ECOMMERCE',
				type: 'collapse',
				icon: 'shopping_cart',
				url: '/apps/e-commerce',
				children: [
					{
						id: 'e-commerce-products',
						title: 'Products',
						type: 'item',
						url: '/apps/e-commerce/products',
						exact: true
					},
					{
						id: 'e-commerce-product-detail',
						title: 'Product Detail',
						type: 'item',
						url: '/apps/e-commerce/products/1/a-walk-amongst-friends-canvas-print',
						exact: true
					},
					{
						id: 'e-commerce-new-product',
						title: 'New Product',
						type: 'item',
						url: '/apps/e-commerce/products/new',
						exact: true
					},
					{
						id: 'e-commerce-orders',
						title: 'Orders',
						type: 'item',
						url: '/apps/e-commerce/orders',
						exact: true
					},
					{
						id: 'e-commerce-order-detail',
						title: 'Order Detail',
						type: 'item',
						url: '/apps/e-commerce/orders/1',
						exact: true
					}
				]
			},
			{
				id: 'academy',
				title: 'Academy',
				translate: 'ACADEMY',
				type: 'item',
				icon: 'school',
				url: '/apps/academy'
			},
			{
				id: 'mail',
				title: 'Mail',
				translate: 'MAIL',
				type: 'item',
				icon: 'email',
				url: '/apps/mail',
				badge: {
					title: 25,
					bg: '#F44336',
					fg: '#FFFFFF'
				}
			},
			{
				id: 'todo',
				title: 'To-Do',
				translate: 'TODO',
				type: 'item',
				icon: 'check_box',
				url: '/apps/todo',
				badge: {
					title: 3,
					bg: 'rgb(255, 111, 0)',
					fg: '#FFFFFF'
				}
			},
			{
				id: 'file-manager',
				title: 'File Manager',
				translate: 'FILE_MANAGER',
				type: 'item',
				icon: 'folder',
				url: '/apps/file-manager'
			},
			{
				id: 'contacts',
				title: 'Contacts',
				translate: 'CONTACTS',
				type: 'item',
				icon: 'account_box',
				url: '/apps/contacts/all'
			},
			{
				id: 'chat',
				title: 'Chat',
				translate: 'CHAT',
				type: 'item',
				icon: 'chat',
				url: '/apps/chat',
				badge: {
					title: 13,
					bg: 'rgb(9, 210, 97)',
					fg: '#FFFFFF'
				}
			},
			{
				id: 'scrumboard',
				title: 'Scrumboard',
				translate: 'SCRUMBOARD',
				type: 'item',
				icon: 'assessment',
				url: '/apps/scrumboard'
			},
			{
				id: 'notes',
				title: 'Notes',
				translate: 'NOTES',
				type: 'item',
				icon: 'note',
				url: '/apps/notes'
			}
		]
	},
	{
		id: 'pages',
		title: 'Pages',
		type: 'group',
		icon: 'pages',
		children: [
			{
				id: 'authentication',
				title: 'Authentication',
				type: 'collapse',
				icon: 'lock',
				badge: {
					title: 10,
					bg: '#525E8A',
					fg: '#FFFFFF'
				},
				children: [
					{
						id: 'authentication-login',
						title: 'Login',
						type: 'item',
						url: '/pages/auth/login'
					},
					{
						id: 'login-v2',
						title: 'Login v2',
						type: 'item',
						url: '/pages/auth/login-2'
					},
					{
						id: 'login-v3',
						title: 'Login v3',
						type: 'item',
						url: '/pages/auth/login-3'
					},
					{
						id: 'authentication-register',
						title: 'Register',
						type: 'item',
						url: '/pages/auth/register'
					},
					{
						id: 'authentication-register-v2',
						title: 'Register v2',
						type: 'item',
						url: '/pages/auth/register-2'
					},
					{
						id: 'authentication-register-v3',
						title: 'Register v3',
						type: 'item',
						url: '/pages/auth/register-3'
					},
					{
						id: 'authentication-forgot-password',
						title: 'Forgot Password',
						type: 'item',
						url: '/pages/auth/forgot-password'
					},
					{
						id: 'authentication-forgot-password-v2',
						title: 'Forgot Password v2',
						type: 'item',
						url: '/pages/auth/forgot-password-2'
					},
					{
						id: 'authentication-reset-password',
						title: 'Reset Password',
						type: 'item',
						url: '/pages/auth/reset-password'
					},
					{
						id: 'authentication-reset-password-v2',
						title: 'Reset Password v2',
						type: 'item',
						url: '/pages/auth/reset-password-2'
					},
					{
						id: 'authentication-lock-screen',
						title: 'Lock Screen',
						type: 'item',
						url: '/pages/auth/lock'
					},
					{
						id: 'authentication-mail-confirmation',
						title: 'Mail Confirmation',
						type: 'item',
						url: '/pages/auth/mail-confirm'
					}
				]
			},
			{
				id: 'coming-soon',
				title: 'Coming Soon',
				type: 'item',
				icon: 'alarm',
				url: '/pages/coming-soon'
			},
			{
				id: 'errors',
				title: 'Errors',
				type: 'collapse',
				icon: 'error',
				children: [
					{
						id: '404',
						title: '404',
						type: 'item',
						url: '/pages/errors/error-404'
					},
					{
						id: '500',
						title: '500',
						type: 'item',
						url: '/pages/errors/error-500'
					}
				]
			},
			{
				id: 'invoice',
				title: 'Invoice',
				type: 'collapse',
				icon: 'receipt',
				children: [
					{
						id: 'modern',
						title: 'Modern',
						type: 'item',
						url: '/pages/invoices/modern'
					},
					{
						id: 'compact',
						title: 'Compact',
						type: 'item',
						url: '/pages/invoices/compact'
					}
				]
			},
			{
				id: 'maintenance',
				title: 'Maintenance',
				type: 'item',
				icon: 'build',
				url: '/pages/maintenance'
			},
			{
				id: 'pricing',
				title: 'Pricing',
				type: 'collapse',
				icon: 'attach_money',
				children: [
					{
						id: 'style-1',
						title: 'Style 1',
						type: 'item',
						url: '/pages/pricing/style-1'
					},
					{
						id: 'style-2',
						title: 'Style 2',
						type: 'item',
						url: '/pages/pricing/style-2'
					},
					{
						id: 'style-3',
						title: 'Style 3',
						type: 'item',
						url: '/pages/pricing/style-3'
					}
				]
			},
			{
				id: 'profile',
				title: 'Profile',
				type: 'item',
				icon: 'person',
				url: '/pages/profile'
			},
			{
				id: 'search',
				title: 'Search',
				type: 'collapse',
				icon: 'search',
				children: [
					{
						id: 'classic-search',
						title: 'Classic Search',
						type: 'item',
						url: '/pages/search/classic'
					},
					{
						id: 'modern-search',
						title: 'Modern Search',
						type: 'item',
						url: '/pages/search/modern'
					}
				]
			},
			{
				id: 'faq',
				title: 'Faq',
				type: 'item',
				icon: 'help',
				url: '/pages/faq'
			},
			{
				id: 'knowledge-base',
				title: 'Knowledge Base',
				type: 'item',
				icon: 'import_contacts',
				url: '/pages/knowledge-base'
			}
		]
	}
];

export default navigationConfig;