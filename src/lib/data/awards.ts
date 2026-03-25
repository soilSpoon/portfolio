export interface AwardItem {
	label: string;
	count: string;
}

export interface Award {
	num: string;
	name: string;
	items: AwardItem[];
}

/** 총 52개 수상 내역 */
export const awards: Award[] = [
	{
		num: '01',
		name: 'Awwwards',
		items: [
			{ label: 'Site of the day',   count: '07' },
			{ label: 'Developer award',   count: '06' },
			{ label: 'Honors',            count: '18' },
		],
	},
	{
		num: '02',
		name: 'FWA',
		items: [
			{ label: 'FWA of the day', count: '04' },
		],
	},
	{
		num: '03',
		name: 'CSS Design Awards',
		items: [
			{ label: 'Site of the day', count: '8' },
		],
	},
	{
		num: '04',
		name: 'Orpetron',
		items: [
			{ label: 'Site of the day',   count: '8' },
			{ label: 'Site of the month', count: '1' },
		],
	},
];
