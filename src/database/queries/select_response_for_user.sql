SELECT
	bot_user_info_id,
	date_responded,
	date_good_until,
	time_responded,
	remarks
FROM public."USER_RESPONSES"
	where
		(bot_user_info_id = $1)
		and
		(
			date_good_until >= current_date
			or date_responded = current_date
		)
	order by
		date_responded asc,
		date_good_until asc

fetch first 1 row only
