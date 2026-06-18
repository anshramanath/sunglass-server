alter table bookmarks add column sku text not null default '';
alter table bookmarks drop constraint bookmarks_user_id_brand_slug_product_slug_key;
