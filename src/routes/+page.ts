import type { PageLoad } from './$types';
import { QuranDataService } from '$lib/services/QuranDataService';
import { buildRenderableItems, buildLookupMaps } from '$lib/utils/globalAddressing';

export const ssr = false;

export const load: PageLoad = async () => {
	const service = QuranDataService.getInstance();
	const quranData = await service.loadData();
	const renderableItems = buildRenderableItems(quranData.surahs);
	const lookupMaps = buildLookupMaps(renderableItems);

	return {
		surahs: quranData.surahs,
		renderableItems,
		lookupMaps
	};
};
