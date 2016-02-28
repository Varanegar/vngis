Create PROCEDURE [dbo].[LoadCustomerByAreaId]
	@AreaId int
AS
BEGIN
	DECLARE @area_points_str VARCHAR(MAX) = ''

	DECLARE @latitude FLOAT
	DECLARE @longitude FLOAT
	DECLARE @first_latitude FLOAT
	DECLARE @first_longitude FLOAT

	DECLARE area_point CURSOR
		FOR SELECT latitude, longitude 
		FROM area_point 
		WHERE area_id = @AreaId	

	OPEN area_point
	FETCH NEXT FROM area_point INTO @latitude, @longitude
	SET  @first_latitude  = @latitude
	SET @first_longitude = @longitude  

	WHILE @@FETCH_STATUS = 0
    BEGIN

		IF (@area_points_str <> '') SET @area_points_str += ','
		SET @area_points_str += CAST(@longitude AS VARCHAR(20)) + ' ' + CAST(@latitude AS VARCHAR(20))

		FETCH NEXT FROM area_point 
		INTO @latitude, @longitude
	END

	CLOSE area_point;
	DEALLOCATE area_point;

	IF (@area_points_str <> '')
	BEGIN
		SET @area_points_str += ','+CAST(@first_longitude AS VARCHAR(20)) + ' ' + CAST(@first_latitude AS VARCHAR(20))

		declare @polygon geometry
		SET @polygon = geometry::STPolyFromText('POLYGON(('+@area_points_str+'))', 4326)

		SELECT	customer.Id, [Title] AS [Desc],
			Longitude, Latitude,
			ISNULL(	(SELECT 1 WHERE ISNULL(customer_area.Id,0) <> 0) ,0) AS PointType
		FROM (	SELECT *, 
						(geometry::STPointFromText('POINT('+ CAST(longitude AS VARCHAR(20)) + ' ' + CAST(latitude AS VARCHAR(20)) +')', 4326)) As cPoint
				FROM customer) as customer LEFT JOIN customer_area ON (customer.Id = customer_area.customer_id)
		WHERE (cPoint.STIntersects(@polygon) = 1)
	END
	ELSE 
		SELECT	customer.Id, [Title] AS [Desc],
				Longitude, Latitude,
				0 AS PointType
		FROM customer 


END
