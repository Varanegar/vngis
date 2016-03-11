CREATE PROCEDURE [dbo].[LoadCustomerByAreaId]
	@AreaId uniqueidentifier,
	@RoutId uniqueidentifier = null,
    @ShowCustRout BIT = 0,
    @ShowCustOtherRout BIT = 0,
    @ShowCustEithoutRout BIT = 0
AS
BEGIN
	DECLARE @area_points_str VARCHAR(MAX) = ''

	DECLARE @latitude FLOAT
	DECLARE @longitude FLOAT
	DECLARE @first_latitude FLOAT
	DECLARE @first_longitude FLOAT

	DECLARE area_point CURSOR
		FOR SELECT latitude, longitude 
		FROM AreaPoint 
		WHERE AreaId = @AreaId	

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
		SET @polygon = @polygon.MakeValid();
		SELECT	customer.Id, [Title] AS [Desc],
			Longitude, Latitude,
			CASE 
			WHEN CustomerArea.AreaId IS null THEN 0
			WHEN (@RoutId IS null) AND (NOT CustomerArea.AreaId IS NULL) THEN 1
			WHEN (NOT @RoutId IS null) AND CustomerArea.AreaId = @RoutId THEN 1
			WHEN (NOT @RoutId IS null) AND CustomerArea.AreaId <> @RoutId THEN 2

			END AS PointType
		FROM (	SELECT *, 
						(geometry::STPointFromText('POINT('+ CAST(longitude AS VARCHAR(20)) + ' ' + CAST(latitude AS VARCHAR(20)) +')', 4326)) As cPoint
				FROM Customer) as customer LEFT JOIN 
			CustomerArea ON (customer.Id = customerArea.CustomerId)
		WHERE (cPoint.STIntersects(@polygon) = 1) 
		and(
			(@RoutId IS null) or
			(
				(not @RoutId IS null) AND
				(
					(	(@ShowCustRout = 1) AND (CustomerArea.AreaId  = @RoutId) )
				or
					(	(@ShowCustOtherRout = 1) AND (NOT CustomerArea.AreaId IS null) )
				or
					(	(@ShowCustEithoutRout = 1) AND (CustomerArea.AreaId  IS null) )
				)
			)
		)

	END
	ELSE 
		SELECT	customer.Id, [Title] AS [Desc],
				Longitude, Latitude,
				0 AS PointType
		FROM customer 


END
GO

CREATE PROCEDURE [dbo].[LoadSelectedCustomerByPathId]
	@PathId uniqueidentifier,
	@Selected BIT
AS
BEGIN

	DECLARE @AreaId uniqueidentifier
	SELECT @AreaId= ParentId FROM dbo.Area
	WHERE Id = @PathId

	DECLARE @area_points_str VARCHAR(MAX) = ''

	DECLARE @latitude FLOAT
	DECLARE @longitude FLOAT
	DECLARE @first_latitude FLOAT
	DECLARE @first_longitude FLOAT

	DECLARE area_point CURSOR
		FOR SELECT latitude, longitude 
		FROM AreaPoint 
		WHERE AreaId = @AreaId	

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

		SELECT	customer.Id, [Title],
			Longitude, Latitude,
			ISNULL(	(SELECT 1 WHERE customerArea.Id <> null) ,0) AS PointType
		FROM (	
				SELECT Id, [Title], [Address], Longitude, Latitude,
						(geometry::STPointFromText('POINT('+ CAST(longitude AS VARCHAR(20)) + ' ' + CAST(latitude AS VARCHAR(20)) +')', 4326)) As cPoint
				FROM customer
			) as customer LEFT JOIN customerArea ON (customer.Id = CustomerArea.CustomerId) AND (AreaId = @PathId)
		WHERE	(cPoint.STIntersects(@polygon) = 1)


		AND		(	(	(@Selected = 1)	AND (customerArea.Id <> null))
				OR	(	(@Selected = 0)	AND (customerArea.Id = null))
				)


	END
	ELSE 
		SELECT	customer.Id, [Title] ,
				Longitude, Latitude,
				0 AS PointType
		FROM customer 
		WHERE	(	(	(@Selected = 1)	AND exists(SELECT 1 FROM CustomerArea WHERE AreaId = @PathId AND CustomerId = customer.Id ))
				OR	(	(@Selected = 0)	AND not exists(SELECT 1 FROM CustomerArea WHERE AreaId = @PathId AND CustomerId = customer.Id ))
				)

END
GO
