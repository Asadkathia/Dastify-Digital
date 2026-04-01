import type { Migration } from './types.ts';
import { addColumnsIfMissing, tableExists } from './helpers.ts';

export const migration: Migration = {
  id: '20260402_0002_homepage_structured_storage',
  name: 'Backfill homepage structured/global media relation columns',
  async up(client) {
    const tableColumns = {
      homepage: [
        { name: '_status', type: 'text' },
        { name: 'nav_logo', type: 'text' },
        { name: 'nav_cta', type: 'text' },
        { name: 'hero_chip', type: 'text' },
        { name: 'hero_description', type: 'text' },
        { name: 'hero_primary_cta', type: 'text' },
        { name: 'hero_secondary_cta', type: 'text' },
        { name: 'hero_image', type: 'text' },
        { name: 'hero_image_media_id', type: 'integer' },
        { name: 'hero_image_alt', type: 'text' },
        { name: 'hero_badge_value', type: 'text' },
        { name: 'hero_badge_label', type: 'text' },
        { name: 'brand_acronym_chip', type: 'text' },
        { name: 'brand_acronym_title', type: 'text' },
        { name: 'brand_acronym_subtitle', type: 'text' },
        { name: 'about_chip', type: 'text' },
        { name: 'about_cta', type: 'text' },
        { name: 'about_image', type: 'text' },
        { name: 'about_image_media_id', type: 'integer' },
        { name: 'about_image_alt', type: 'text' },
        { name: 'case_studies_chip', type: 'text' },
        { name: 'case_studies_title', type: 'text' },
        { name: 'case_studies_cta', type: 'text' },
        { name: 'case_studies_main_tag', type: 'text' },
        { name: 'case_studies_main_title', type: 'text' },
        { name: 'case_studies_main_description', type: 'text' },
        { name: 'case_studies_main_stat', type: 'text' },
        { name: 'case_studies_main_stat_label', type: 'text' },
        { name: 'case_studies_main_image', type: 'text' },
        { name: 'case_studies_main_image_media_id', type: 'integer' },
        { name: 'case_studies_main_alt', type: 'text' },
        { name: 'services_chip', type: 'text' },
        { name: 'services_description', type: 'text' },
        { name: 'mission_chip', type: 'text' },
        { name: 'mission_title', type: 'text' },
        { name: 'mission_description', type: 'text' },
        { name: 'mission_cta', type: 'text' },
        { name: 'mission_image', type: 'text' },
        { name: 'mission_image_media_id', type: 'integer' },
        { name: 'mission_image_alt', type: 'text' },
        { name: 'insights_chip', type: 'text' },
        { name: 'insights_title', type: 'text' },
        { name: 'insights_cta', type: 'text' },
        { name: 'faq_chip', type: 'text' },
        { name: 'faq_title', type: 'text' },
        { name: 'faq_intro', type: 'text' },
        { name: 'faq_cta', type: 'text' },
        { name: 'cta_chip', type: 'text' },
        { name: 'cta_subtitle', type: 'text' },
        { name: 'cta_input_placeholder', type: 'text' },
        { name: 'cta_button', type: 'text' },
        { name: 'cta_note', type: 'text' },
        { name: 'footer_logo', type: 'text' },
        { name: 'footer_tagline', type: 'text' },
        { name: 'footer_copyright', type: 'text' },
      ],
      homepage_features_cards: [{ name: 'image_media_id', type: 'integer' }],
      homepage_case_studies_minis: [{ name: 'image_media_id', type: 'integer' }],
      homepage_services_items: [{ name: 'image_media_id', type: 'integer' }],
      homepage_insights_items: [{ name: 'image_media_id', type: 'integer' }],
    } as const;

    for (const [tableName, columns] of Object.entries(tableColumns)) {
      await addColumnsIfMissing(client, tableName, [...columns]);
    }

    if (!(await tableExists(client, 'homepage'))) {
      return;
    }

    const rowCountResult = await client.execute('SELECT COUNT(*) AS count FROM "homepage";');
    const rowCount = Number((rowCountResult.rows?.[0]?.count as number | string | undefined) ?? 0);

    if (rowCount === 0) {
      await client.execute(
        'INSERT INTO "homepage" ("updated_at", "created_at") VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);',
      );
    }
  },
};
