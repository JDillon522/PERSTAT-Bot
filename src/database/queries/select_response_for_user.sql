SELECT
	bot_user_info_id,
	date_responded,
	date_good_until,
	remarks,
	vouched_by
FROM public."USER_RESPONSES"
	where
		(bot_user_info_id = 7)
		and
		(
			date_good_until::TIMESTAMP::DATE >= current_date
			or date_responded::TIMESTAMP::DATE = current_date 
		)
	order by
		date_responded asc,
		date_good_until asc

fetch first 1 row only;

-- select current_timestamp