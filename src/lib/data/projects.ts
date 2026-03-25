export interface Project {
	slug: string;
	name: string;
	tags: string[];
	imgClass: string;
}

export const projects: Project[] = [
	{
		slug: 'lando-norris',
		name: 'Lando Norris',
		tags: ['● Brand & Design', '△ Development', '⁂ WebGL, 3d'],
		imgClass: 'is-lando',
	},
	{
		slug: 'vizcom',
		name: 'Vizcom',
		tags: ['● Design', '△ Development', '⁂ WebGL, 3d'],
		imgClass: 'is--vizcom',
	},
	{
		slug: 'aether1',
		name: 'Aether 1',
		tags: ['● Design', '△ Development', '⁂ WebGL, 3d'],
		imgClass: 'is--aether',
	},
	{
		slug: 'bella',
		name: 'Bella Kitchenwear',
		tags: ['● Design', '△ Development', '⁂ WebGL, 3d'],
		imgClass: 'is--bella',
	},
	{
		slug: 'jasper',
		name: 'Jasper',
		tags: ['● Design', '⁂ W Motion / Rive'],
		imgClass: 'is--jasp',
	},
	{
		slug: 'slack-annual-report',
		name: 'Slack',
		tags: ['● Content', '⁂ 3d'],
		imgClass: 'is--slack',
	},
	{
		slug: 'aptos-labs',
		name: 'Aptos Labs',
		tags: ['● Brand', '△ Development', '⁂ WebGL, 3d'],
		imgClass: 'is--totem is--aptos',
	},
	{
		slug: 'webflow',
		name: 'Webflow.com',
		tags: ['● Design', '△ Development'],
		imgClass: 'is--wf',
	},
	{
		slug: 'david-lee-artist',
		name: 'David Lee, Artist',
		tags: ['● Brand & Design', '△ Development'],
		imgClass: 'is--dl',
	},
	{
		slug: 'cmcc',
		name: 'Cmcc',
		tags: ['● Design', '△ Development'],
		imgClass: 'is--cmcc',
	},
	{
		slug: 'the-online-school',
		name: 'The Online School',
		tags: ['● Design', '△ Development'],
		imgClass: 'is--tos',
	},
];
