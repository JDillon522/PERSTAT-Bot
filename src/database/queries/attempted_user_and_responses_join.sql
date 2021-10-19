SELECT 
	public."BOT_USER_INFO".*,
	"USER_RESPONSES".*
FROM public."BOT_USER_INFO"
	left join lateral 
	(
		SELECT 
			bot_user_info_id,
			date_responded, 
			date_good_until, 
			time_responded, 
			remarks
		FROM public."USER_RESPONSES"
			where
				(
					date_good_until >= current_date
					or date_responded = current_date
				)
			order by
				date_responded asc,
				date_good_until asc


		fetch first 1 row only
	)
	"USER_RESPONSES"
 		on "BOT_USER_INFO".id = "USER_RESPONSES".bot_user_info_id;
