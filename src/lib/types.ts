export type PinResponse = {
	alt_text: string | null;
	debug_info_html: string | null;
	domain: string;
	title: string;
	board: {
		url: string;
		layout: string;
		followed_by_me: boolean;
		is_collaborative: boolean;
		privacy: string;
		image_thumbnail_url: string;
		owner: {
			is_ads_only_profile: boolean;
			full_name: string;
			blocked_by_me: boolean;
			username: string;
			image_small_url: string;
			type: string;
			id: string;
			ads_only_profile_site: string | null;
			image_large_url: string;
			explicitly_followed_by_me: boolean;
		};
		collaborated_by_me: boolean;
		id: string;
		type: string;
		name: string;
	};
	ad_match_reason: number;
	promoted_is_lead_ad: boolean;
	attribution: string | null;
	manual_interest_tags: string | null;
	creator_analytics: string | null;
	grid_description: string;
	favorite_user_count: number;
	insertion_id: string | null;
	is_whitelisted_for_tried_it: boolean;
	is_eligible_for_web_closeup: boolean;
	is_stale_product: boolean;
	reaction_counts: {
		'1': number;
		'11': number;
	};
	grid_title: string;
	view_tags: string[];
	privacy: string;
	is_eligible_for_related_products: boolean;
	tracking_params: string;
	embed: string | null;
	call_to_action_text: string | null;
	description_html: string;
	carousel_data: string | null;
	is_uploaded: boolean;
	story_pin_data_id: string | null;
	promoted_lead_form: string | null;
	image_signature: string;
	description: string;
	type: string;
	is_downstream_promotion: boolean;
	is_native: boolean;
	is_oos_product: boolean;
	videos: string | null;
	additional_hide_reasons: string[];
	comments: {
		uri: string;
		data: string[];
		bookmark: string | null;
	};
	product_pin_data: string | null;
	method: string;
	is_playable: boolean;
	price_value: number;
	native_creator: string | null;
	price_currency: string;
	sponsorship: string | null;
	is_quick_promotable: boolean;
	video_status: string | null;
	is_video: boolean;
	rich_summary: {
		products: string[];
		type_name: string;
		actions: string[];
		url: string;
		display_name: string;
		apple_touch_icon_images: {
			orig: string;
		};
		display_description: string;
		id: string;
		site_name: string;
		apple_touch_icon_link: string;
		favicon_images: {
			orig: string;
		};
		type: string;
		favicon_link: string;
	};
	shopping_flags: string[];
	comment_count: number;
	has_required_attribution_provider: boolean;
	pinner: {
		is_ads_only_profile: boolean;
		full_name: string;
		blocked_by_me: boolean;
		username: string;
		image_small_url: string;
		type: string;
		id: string;
		ads_only_profile_site: string | null;
		image_large_url: string;
		explicitly_followed_by_me: boolean;
	};
	should_open_in_stream: boolean;
	story_pin_data: string | null;
	promoter: string | null;
	repin_count: number;
	done_by_me: boolean;
	dominant_color: string;
	image_crop: {
		min_y: number;
		max_y: number;
	};
	video_status_message: string | null;
	is_eligible_for_pdp: boolean;
	id: string;
	created_at: string;
	aggregated_pin_data: {
		is_shop_the_look: boolean;
		creator_analytics: string | null;
		did_it_data: {
			recommend_scores: {
				score: number;
				count: number;
			}[];
			videos_count: number;
			details_count: number;
			responses_count: number;
			recommended_count: number;
			user_count: number;
			rating: number;
			tags: string[];
			type: string;
			images_count: number;
		};
		has_xy_tags: boolean;
		aggregated_stats: {
			saves: number;
			done: number;
		};
		id: string;
	};
	promoted_is_removable: boolean;
	campaign_id: string | null;
	is_repin: boolean;
	is_promoted: boolean;
	link: string | null;
	access: string[];
	favorited_by_me: boolean;
	images: {
		'170x': {
			width: number;
			height: number;
			url: string;
		};
		'136x136': {
			width: number;
			height: number;
			url: string;
		};
		'236x': {
			width: number;
			height: number;
			url: string;
		};
		'474x': {
			width: number;
			height: number;
			url: string;
		};
		'736x': {
			width: number;
			height: number;
			url: string;
		};
		orig: {
			width: number;
			height: number;
			url: string;
		};
	};
};

export type Analysis = {
	isSameDimensions: boolean;
	dimensionDifference: {
		width: number;
		height: number;
	};
	rawMisMatchPercentage: number;
	misMatchPercentage: string;
	diffBounds: {
		top: number;
		left: number;
		bottom: number;
		right: number;
	};
	analysisTime: number;
};

export type ui_settings = {
	quality: string;
	gaussian_radius: number;
	mask_threshold: number;
	paint_alpha: number;
	distinct_color: boolean;
	positive: boolean;
	negative: boolean;
	opacity: number;
	random: boolean;
};
