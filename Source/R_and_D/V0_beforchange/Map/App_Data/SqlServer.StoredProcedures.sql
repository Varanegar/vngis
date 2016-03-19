
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
		SELECT	customer.Id, [Desc],
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
		SELECT	customer.Id, [Desc] AS [Desc],				
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
				Code, ShopTitle, Phone, [Address],
			Longitude, Latitude,
			ISNULL(	(SELECT 1 WHERE customerArea.Id <> null) ,0) AS PointType
		FROM (	
				SELECT *,
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
				Code, ShopTitle, Phone, [Address],
				Longitude, Latitude,
				0 AS PointType
		FROM customer 
		WHERE	(	(	(@Selected = 1)	AND exists(SELECT 1 FROM CustomerArea WHERE AreaId = @PathId AND CustomerId = customer.Id ))
				OR	(	(@Selected = 0)	AND not exists(SELECT 1 FROM CustomerArea WHERE AreaId = @PathId AND CustomerId = customer.Id ))
				)

END

GO


-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
create PROCEDURE [dbo].[LoadVisitorsMarker]
	@VisitorIds VARCHAR(8000),
	@Order bit,
    @LackOrder bit,
    @LackVisit bit,
    @StopWithoutCustomer bit,
    @StopWithoutActivity BIT
AS
BEGIN

-- =============================================
-- create visitor ids table
-- =============================================
	DECLARE @VisitorIdsTbl TABLE(Value VARCHAR(50) );
	IF (@VisitorIds <> '')
	BEGIN
  
		WITH StrCTE(start, stop) AS
		(

		  SELECT  1, CHARINDEX(',' , @VisitorIds )

		  UNION ALL

		  SELECT  stop + 1, CHARINDEX(',' ,@VisitorIds  , stop + 1)

		  FROM StrCTE

		  WHERE stop > 0

		)

		insert into @VisitorIdsTbl
		SELECT   SUBSTRING(@VisitorIds , start, CASE WHEN stop > 0 THEN stop-start ELSE 4000 END) AS stringValue
		FROM StrCTE 
	END
-- =============================================
-- create table for adding customer when has diferent location from transaction
-- =============================================
	DECLARE @TempTbl TABLE(typ int );
	insert into @TempTbl VALUES(1)
	insert into @TempTbl VALUES(2)

-- =============================================
-- select markers
-- =============================================
	SELECT 
			trn.Id,
            trn.[Desc],
            VisitorId AS MasterId,
            ISNULL((SELECT trn.Latitude WHERE typ = 1), cst.Latitude) AS Latitude,
            ISNULL((SELECT trn.Longitude WHERE typ = 1), cst.Longitude) AS Longitude,           
			ISNULL((SELECT TransactionType WHERE typ = 1), 5) AS PointType,
            ISNULL((SELECT CustomerType WHERE typ = 1), 0) AS SubType,
			ISNULL((SELECT CAST(trn.intId AS VARCHAR(5)) WHERE (cPoint.STDistance(tPoint) > 0.1)), '' ) AS Lable
	
	 FROM 
		(	SELECT *, 
					(geography::STPointFromText('POINT('+ CAST(longitude AS VARCHAR(20)) + ' ' + CAST(latitude AS VARCHAR(20)) +')', 4326)) As tPoint 
			FROM [dbo].[Transaction] JOIN @VisitorIdsTbl ON value = [VisitorId]
		) trn 
	 JOIN 
		 (	SELECT *, 
					(geography::STPointFromText('POINT('+ CAST(longitude AS VARCHAR(20)) + ' ' + CAST(latitude AS VARCHAR(20)) +')', 4326)) As cPoint 
			FROM dbo.Customer 
		 ) cst ON CustomerId = cst.Id 
	 JOIN @TempTbl as tmp ON (	(tmp.typ = 1) or ((tmp.typ = 2) AND (cPoint.STDistance(tPoint) > 0.1) )  )
	 WHERE 
	 (	
		(	(@Order = 1) AND (TransactionType = 0) )
	OR	(	(@LackOrder = 1) AND (TransactionType = 1) )
	OR	(	(@LackVisit = 1) AND (TransactionType = 2) )
	OR	(	(@StopWithoutCustomer = 1) AND (TransactionType = 3) )
	OR	(	(@StopWithoutActivity = 1) AND (TransactionType = 4) )
    )

END

GO


