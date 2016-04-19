
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
		
		SELECT	customer.Id, 
				Longitude, Latitude,
				CASE 
				WHEN CustomerArea.AreaId IS null THEN 0
				WHEN (@RoutId IS null) AND (NOT CustomerArea.AreaId IS NULL) THEN 1
				WHEN (NOT @RoutId IS null) AND (CustomerArea.AreaId = @RoutId) THEN 1
				WHEN (NOT @RoutId IS null) AND (CustomerArea.AreaId <> @RoutId) THEN 2
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
					(	(@ShowCustOtherRout = 1) AND (NOT CustomerArea.AreaId IS null) AND (CustomerArea.AreaId <> @RoutId ) )
				or
					(	(@ShowCustEithoutRout = 1) AND (CustomerArea.AreaId  IS null) )
				)
			)
		)

	END

	--ELSE 
	--	SELECT	0 customer.Id, 'hhhhhhh' AS [Desc],				
	--			Longitude, Latitude,
	--			0 AS PointType
	--	FROM customer 

END




GO


CREATE PROCEDURE [dbo].[LoadCustomerReport]
        @AreaId uniqueidentifier,
        @Type int =null,
        @FromDate varchar(10)=null,
        @ToDate varchar(10)=null,
        @SaleOffice uniqueidentifier=null,
        @Header uniqueidentifier=null,
        @Seller uniqueidentifier=null,
        @CustomerClass uniqueidentifier=null,
        @CustomerActivity uniqueidentifier=null,
		@CustomerDegree uniqueidentifier=null,
        @GoodGroup uniqueidentifier=null,
        @DynamicGroup uniqueidentifier=null,
        @Good uniqueidentifier=null,
        @CommercialName varchar(50)=null,
        @DayCount int=null,
        @VisitCount bit=null,
		@LackOfVisitCount bit=null,
        @LackOfSaleCount bit=null,
        @NewCustomerCount bit=null,
        @DuringCheck bit=null,
        @RejectCheck bit=null
AS
BEGIN
	select   null AreaId,
        'عنوان منطقه' [Desc],
        10 as  ActiveCustomerCount ,
        null VisitCount ,
        20 LackOfVisitCount ,
        80 LackOfSaleCount ,
        2000 NewCustomerCount,
        12 DuringCheckCount ,
        90000300.0 DuringCheckPrice ,
        3 RejectCheckCount ,
        3980000.0 RejectCheckPrice 

END

GO


CREATE PROCEDURE [dbo].[LoadGoodByValueReport]
/*
        @AreaId uniqueidentifier,
        @Type int =null,
        @FromDate varchar(10)=null,
        @ToDate varchar(10)=null,
        @SaleOffice uniqueidentifier=null,
        @Header uniqueidentifier=null,
        @Seller uniqueidentifier=null,
        @CustomerClass uniqueidentifier=null,
        @CustomerActivity uniqueidentifier=null,
		@CustomerDegree uniqueidentifier=null,
        @GoodGroup uniqueidentifier=null,
        @DynamicGroup uniqueidentifier=null,
        @Good uniqueidentifier=null,
        @CommercialName varchar(50)=null
*/
AS
BEGIN
	select 
		Id,
        [Title] [Desc],
		[Latitude],
		[Longitude]
	from [dbo].[Customer]
	where (isnull(Latitude,0) <> 0) AND (isnull(Longitude, 0) <> 0)
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

		SELECT	customer.Id, 
				[Desc],		
				[Title] , Activity,
				Code, ShopTitle, Phone, [Address],
				Longitude, Latitude
			--ISNULL(	(SELECT 1 WHERE customerArea.Id <> null) ,0) AS PointType
		FROM (	
				SELECT *,
						(geometry::STPointFromText('POINT('+ CAST(longitude AS VARCHAR(20)) + ' ' + CAST(latitude AS VARCHAR(20)) +')', 4326)) As cPoint
				FROM customer
			) as customer -- LEFT JOIN customerArea ON (customer.Id = CustomerArea.CustomerId) AND (AreaId = @PathId)
		WHERE	(cPoint.STIntersects(@polygon) = 1)
		And	(	(	(@Selected = 1)	AND exists(SELECT 1 FROM CustomerArea WHERE AreaId = @PathId AND CustomerId = customer.Id ))
				OR	(	(@Selected = 0)	AND not exists(SELECT 1 FROM CustomerArea WHERE /*AreaId = @PathId AND*/ CustomerId = customer.Id ))
				)

		--AND		(	(	(@Selected = 1)	AND (not customerArea.Id is null))
		--		OR	(	(@Selected = 0)	AND (customerArea.Id is null))
		--		)


	END
	ELSE 
		SELECT	customer.Id, 
				[Desc],		
				[Title] , Activity,
				Code, ShopTitle, Phone, [Address],
				Longitude, Latitude
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
CREATE PROCEDURE [dbo].[LoadVisitorsMarker]
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
            ISNULL((SELECT ISNULL((SELECT CustomerType WHERE cPoint.STDistance(tPoint) <= 0.1),3 ) WHERE typ = 1), 0) AS SubType,
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

Create PROCEDURE [dbo].[LoadGoodReport]
	@ClientId uniqueidentifier, @AreaId uniqueidentifier 
	, @ShowOrderCount BIT,@ShowSaleCount BIT,@ShowRetSaleCount BIT,@ShowSaleItemCount BIT
	, @ShowRetSaleItemCount BIT,@ShowSaleQty BIT,@ShowSaleCarton BIT,@ShowRetSaleQty BIT,@ShowRetSaleCarton BIT
	, @ShowSaleAmount BIT,@ShowRetSaleAmount BIT, @ShowSaleWeight BIT, @ShowRetSaleWeight BIT,@ShowSaleDiscount BIT
	, @ShowRetSaleDiscount BIT,@ShowPrizeCount BIT,@ShowPrizeQty BIT,@ShowPrizeCarton BIT,@HavingCondition varchar(max)
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


		SELECT
			Case @ShowOrderCount WHEN 1 THEN sum(OrderCount) END as OrderCount ,
			Case @ShowSaleCount WHEN 1 THEN sum(SaleCount) END as SaleCount ,
			Case @ShowRetSaleCount WHEN 1 THEN sum(RetSaleCount) END as RetSaleCount, 
			Case @ShowSaleItemCount WHEN 1 THEN sum(SaleItemCount) END as SaleItemCount, 
			Case @ShowRetSaleItemCount WHEN 1 THEN sum(RetSaleItemCount) END as RetSaleItemCount, 
			Case @ShowSaleQty WHEN 1 THEN sum(SaleQty) END as SaleQty ,
			Case @ShowSaleCarton WHEN 1 THEN sum(SaleCarton) END as SaleCarton, 
			Case @ShowRetSaleQty WHEN 1 THEN sum(RetSaleQty) END as RetSaleQty ,
			Case @ShowRetSaleCarton WHEN 1 THEN sum(RetSaleCarton) END as RetSaleCarton, 
			Case @ShowSaleAmount WHEN 1 THEN sum(SaleAmount) END as SaleAmount ,
			Case @ShowRetSaleAmount WHEN 1 THEN sum(RetSaleAmount) END as RetSaleAmount, 
			Case @ShowSaleWeight WHEN 1 THEN sum(SaleWeight) END as SaleWeight ,
			Case @ShowRetSaleWeight WHEN 1 THEN sum(RetSaleWeight) END as RetSaleWeight, 
			Case @ShowSaleDiscount WHEN 1 THEN sum(SaleDiscount) END as SaleDiscount ,
			Case @ShowRetSaleDiscount WHEN 1 THEN sum(RetSaleDiscount) END as RetSaleDiscount ,
			Case @ShowPrizeCount WHEN 1 THEN sum(SalePrizeCount) END as SalePrizeCount ,
			Case @ShowPrizeQty WHEN 1 THEN sum(PrizeQty) END as PrizeQty ,
			Case @ShowPrizeCarton WHEN 1 THEN sum(PrizeCarton ) END as PrizeCarton 
		FROM	GoodReportCache
		WHERE	(ClientId = @ClientId)
		AND		(CPoint.STIntersects(@polygon) = 1) 


	END
	ELSE


	Select
        Case @ShowOrderCount WHEN 1 THEN 0 END as OrderCount ,
        Case @ShowSaleCount WHEN 1 THEN 0 END as SaleCount ,
        Case @ShowRetSaleCount WHEN 1 THEN 0 END as RetSaleCount, 
        Case @ShowSaleItemCount WHEN 1 THEN 0 END as SaleItemCount, 
        Case @ShowRetSaleItemCount WHEN 1 THEN 0 END as RetSaleItemCount, 
        Case @ShowSaleQty WHEN 1 THEN 0.0 END as SaleQty ,
        Case @ShowSaleCarton WHEN 1 THEN 0.0 END as SaleCarton, 
        Case @ShowRetSaleQty WHEN 1 THEN 0.0 END as RetSaleQty ,
        Case @ShowRetSaleCarton WHEN 1 THEN 0.0 END as RetSaleCarton, 
        Case @ShowSaleAmount WHEN 1 THEN 0.0 END as SaleAmount ,
        Case @ShowRetSaleAmount WHEN 1 THEN 0.0 END as RetSaleAmount, 
        Case @ShowSaleWeight WHEN 1 THEN 0.0 END as SaleWeight ,
        Case @ShowRetSaleWeight WHEN 1 THEN 0.0 END as RetSaleWeight, 
        Case @ShowSaleDiscount WHEN 1 THEN 0.0 END as SaleDiscount ,
        Case @ShowRetSaleDiscount WHEN 1 THEN 0.0 END as RetSaleDiscount ,
        Case @ShowPrizeCount WHEN 1 THEN 0.0 END as SalePrizeCount ,
        Case @ShowPrizeQty WHEN 1 THEN 0 END as PrizeQty ,
        Case @ShowPrizeCarton WHEN 1 THEN 0.0 END as PrizeCarton 
END
GO