/****** Object:  StoredProcedure [dbo].[TransactionReport_Map]    Script Date: 1/19/2016 10:24:06 AM ******/
-- EXEC TransactionReport_Map
CREATE Procedure [dbo].[TransactionReport_Map]
	@chOrder bit= null, 
	@chFactor bit= null, 
	@chNotOrdered bit= null, 
	@chNotVisit bit= null, 
	@chCustomer bit= null, 
	@chMachin bit= null, 
	@chVisitor bit= null, 
	@FromDate VARCHAR(10) = '',
	@ToDate VARCHAR(10) = '',
	@FromTime VARCHAR(8)= '',
	@ToTime VARCHAR(8)= '',
	@VisitorGroupId int= null,
	@VisitorId int= null,
	@CustomerGroupId int= null,
	@CustomerId int= null,
	@GoodGroupId int= null,
	@GoodId int= null,
	@DriverId int= null,
	@DistributerId int= null,
	@FromRoadId int= null,
	@ToRoadId int= null,
	@DistributArea varchar(10)= null,
	@Area varchar(10)= null
AS 
BEGIN

select * from(

Select
			 --getdate() As timestpm
			 CAST(51.2643878318375 AS float) As Longitude
			, CAST(35.6520741056300  AS float) As Latitude
			, 1 As PointType
			, 1 as MasterId			
			, 'سفارش' as [desc]
			UNION 
Select
			 --getdate() As timestpm
			 CAST(51.4156723022461 AS float) As Longitude
			, CAST(35.7519456318341  AS float) As Latitude
			, 3 As PointType
			, 2 as MasterId			
			, '3' as [desc]
			UNION 
			
Select
			 --getdate() As timestpm
			 CAST(51.4156723022461 AS float) As Longitude
			, CAST(35.713904233681  AS float) As Latitude
			, 3 As PointType
			, 3 as MasterId			
			, '3kjkljljl' as [Desc]
			UNION 
			
Select
			 --getdate() As timestpm
			 CAST(51.3050723022461 AS float) As Longitude
			, CAST(35.7519456318341  AS float) As Latitude
			, 4 As PointType
			, 4 as MasterId			
			, '4 hdhdhddgdgdfdg jasdaj' as [desc]
			UNION 
			
Select
			 --getdate() As timestpm
			 CAST(51.2050723022461 AS float) As Longitude
			, CAST(35.7519456318341  AS float) As Latitude
			, 4 As PointType
			, 5 as MasterId			
			, '5' as [desc]
			UNION 
Select
			 --getdate() As timestpm
			 CAST(51.3000723022461 AS float) As Longitude
			, CAST(35.7419456318341  AS float) As Latitude
			, 5 As PointType
			, 3 as MasterId			
			, '5' as [desc]
			UNION 
Select
			-- getdate() As timestpm
			 CAST(51.2643878318305 AS float)As lng
			, CAST(35.6620741066399 AS float)  As ltd
			, 6 As PointType
			, 2 as MasterId			
			, '6' as [desc]
UNION 			
Select
			 CAST(51.2643878318375 AS float) As lng
			, CAST(35.6520741056300  AS float) As ltd
			, 7 As PointType
			, 1 as MasterId			
			, '7' as [desc]
UNION 			
Select
			 CAST(51.4543878018305 AS float)As lng
			, CAST(35.6620741064399 AS float)  As ltd
			, 7 As PointType
			, 1 as MasterId			
			, '7' as [desc]
) as TBL
where 

	  ((@chOrder = 1) and (PointType = 1)) 
	or((@chFactor = 1) and (PointType = 2)) 
	or((@chNotOrdered = 1) and (PointType = 3)) 
	or((@chNotVisit = 1) and (PointType = 4)) 
	or((@chCustomer = 1) and (PointType = 5)) 
	or((@chVisitor = 1) and (PointType = 6)) 
	or((@chMachin = 1) and (PointType = 7)) 
	--or((@chNotVisit = 1) and (PointType = 7)) 			
END
GO
/****** Object:  StoredProcedure [dbo].[TransactionReport_List]    Script Date: 1/19/2016 10:24:06 AM ******/
CREATE Procedure [dbo].[TransactionReport_List]
	@chOrder bit= null, 
	@chFactor bit= null, 
	@chNotOrdered bit= null, 
	@chCustomer bit= null, 
	@chMachin bit= null, 
	@FromDate VARCHAR(10) = '',
	@ToDate VARCHAR(10) = '',
	@FromTime VARCHAR(8)= '',
	@ToTime VARCHAR(8)= '',
	@VisitorGroupId int= null,
	@VisitorId int= null,
	@CustomerGroupId int= null,
	@CustomerId int= null,
	@GoodGroupId int= null,
	@GoodId int= null,
	@DriverId int= null,
	@DistributerId int= null,
	@FromRoadId int= null,
	@ToRoadId int= null,
	@DistributArea varchar(10)= null,
	@Area varchar(10)= null
As 
BEGIN
	SELECT
			'94/01/01' OrderDate,
            '00:00' Start,
            1 OrderNumber,
            '' Customer,
            '' Visitor,
            '' Duration,
            0.0 OrderPrice,
            0 FactorNumber,
            0.0 FactorPrice,
            0.0 BalancePrice,
            '' DistName,
            '' Road,
            '' PubPayKind
END
GO
/****** Object:  StoredProcedure [dbo].[TrackerReport_Map]    Script Date: 1/19/2016 10:24:06 AM ******/
-- EXEC TransactionReport_Map
CREATE Procedure [dbo].[TrackerReport_Map]
	@chVisitor bit= null, 
	@chMachin bit= null, 
	@FromDate VARCHAR(10) = '',
	@ToDate VARCHAR(10) = '',
	@FromTime VARCHAR(8)= '',
	@ToTime VARCHAR(8)= '',
	@Id int= null
AS 
BEGIN
Select
			 getdate() As timestpm
			, CAST(51.2643878318375 AS float) As Longitude
			, CAST(35.6520741056300  AS float) As Latitude
			, 4 As MasterId
UNION 
Select
			  getdate() As timestpm
			, CAST(51.4643878318305 AS float)As lng
			, CAST(35.6620741066399 AS float)  As ltd
			, 4 As MasterId
UNION 
Select
			  getdate() As timestpm
			, CAST(51.4543878018305 AS float)As lng
			, CAST(35.6620741064399 AS float)  As ltd
			, 5 As MasterId
UNION 
Select
			  getdate() As timestpm
			, CAST(51.4543877518305 AS float)As lng
			, CAST(35.6320741060399 AS float)  As ltd
			, 5 As MasterId
UNION 
Select
			  getdate() As timestpm
			, CAST(51.2643877018305 AS float)As lng
			, CAST(35.6620741065599 AS float)  As ltd
			, 5 As MasterId
UNION 
Select
			  getdate() As timestpm
			, CAST(51.1043877018305 AS float)As lng
			, CAST(35.4620741065599 AS float)  As ltd
			, 5 As MasterId
END
GO
/****** Object:  StoredProcedure [dbo].[LoadVisitor]    Script Date: 02/04/2016 00:04:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/****** Object:  StoredProcedure [dbo].[LoadVisitor]    Script Date: 1/19/2016 10:24:06 AM ******/
CREATE Procedure [dbo].[LoadVisitor]
	@Group int
AS
BEGIN 
SELECT ID,Title
FROM (

			Select
				1 ID
				,CAST('Vis11' AS VARCHAR(50)) Title
				,1 AS GroupId
		UNION
			Select
				2 ID
				,CAST('Vis12' AS VARCHAR(50)) Title
				,1 AS GroupId
		UNION
			Select
				3 ID
				,CAST('Vis13' AS VARCHAR(50)) Title
				,1 AS GroupId
		UNION
			Select
				4 ID
				,CAST('Vis21' AS VARCHAR(50)) Title
				,2 AS GroupId
		UNION
			Select
				5 ID
				,CAST('Vis31' AS VARCHAR(50)) Title
				,3 AS GroupId
		UNION
			Select
				6 ID
				,CAST('Vis32' AS VARCHAR(50)) Title
				,3 AS GroupId
) AS VisitorTable
WHERE GroupId = @group
END
GO
/****** Object:  StoredProcedure [dbo].[LoadRoad]    Script Date: 02/04/2016 00:04:48 ******/
/****** Object:  StoredProcedure [dbo].[LoadRoad]    Script Date: 1/19/2016 10:24:06 AM ******/
CREATE Procedure [dbo].[LoadRoad]
AS
BEGIN 
	Select
		1 ID
		,CAST('Road1' AS VARCHAR(50)) Title
UNION
	Select
		2 ID
		,CAST('Road2' AS VARCHAR(50)) Title
UNION
	Select
		3 ID
		,CAST('Road3' AS VARCHAR(50)) Title
UNION
	Select
		4 ID
		,CAST('Road4' AS VARCHAR(50)) Title
UNION
	Select
		5 ID
		,CAST('Road5' AS VARCHAR(50)) Title
UNION
	Select
		6 ID
		,CAST('Road6' AS VARCHAR(50)) Title
END
GO
/****** Object:  StoredProcedure [dbo].[LoadLimits_Point]    Script Date: 02/04/2016 00:04:48 ******/
/****** Object:  StoredProcedure [dbo].[LoadLimits_Point]    Script Date: 1/19/2016 10:24:06 AM ******/
-- EXEC TransactionReport_Map
CREATE Procedure [dbo].[LoadLimits_Point]
	@Id int= null
AS 
BEGIN
SELECT
			14 AS Id
			, CAST(51.2643878318375 AS float) As Longitude
			, CAST(35.6520741056300  AS float) As Latitude
			, 4 As MasterId

UNION 
Select
			26 AS Id
			, CAST(51.4543878018305 AS float)As lng
			, CAST(35.6620741064399 AS float)  As ltd
			, 4 As MasterId
UNION 
Select
			33 AS Id
			, CAST(51.4543877518305 AS float)As lng
			, CAST(35.6320741060399 AS float)  As ltd
			, 4 As MasterId

END
GO
/****** Object:  StoredProcedure [dbo].[LoadGood]    Script Date: 02/04/2016 00:04:48 ******/
/****** Object:  StoredProcedure [dbo].[LoadGood]    Script Date: 1/19/2016 10:24:06 AM ******/
CREATE Procedure [dbo].[LoadGood]
	@Group int
As
BEGIN 
SELECT ID,Title
FROM (

			Select
				1 ID
				,CAST('Good11' AS VARCHAR(50)) Title
				,1 AS GroupId
		UNION
			Select
				2 ID
				,CAST('Good12' AS VARCHAR(50)) Title
				,1 AS GroupId
		UNION
			Select
				3 ID
				,CAST('Good13' AS VARCHAR(50)) Title
				,1 AS GroupId
		UNION
			Select
				4 ID
				,CAST('Good14' AS VARCHAR(50)) Title
				,1 AS GroupId
		UNION
			Select
				5 ID
				,CAST('Good15' AS VARCHAR(50)) Title
				,1 AS GroupId
		UNION
			Select
				6 ID
				,CAST('Good21' AS VARCHAR(50)) Title
				,2 AS GroupId
) AS VisitorTable
WHERE GroupId = @group
END
GO
/****** Object:  StoredProcedure [dbo].[LoadDriver]    Script Date: 1/19/2016 10:24:06 AM ******/
CREATE Procedure [dbo].[LoadDriver]
As 
BEGIN
	Select
		1 ID
		,CAST('Driver1' AS VARCHAR(50)) Title
UNION
	Select
		2 ID
		,CAST('Driver2' AS VARCHAR(50)) Title
UNION
	Select
		3 ID
		,CAST('Driver3' AS VARCHAR(50)) Title
END
GO
/****** Object:  StoredProcedure [dbo].[LoadDistributer]    Script Date: 02/04/2016 00:04:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/****** Object:  StoredProcedure [dbo].[LoadDistributer]    Script Date: 1/19/2016 10:24:06 AM ******/
CREATE Procedure [dbo].[LoadDistributer]
As 
BEGIN
	Select
		1 ID
		,CAST('Distributer1' AS VARCHAR(50)) Title
UNION
	Select
		2 ID
		,CAST('Distributer2' AS VARCHAR(50)) Title
UNION
	Select
		3 ID
		,CAST('Distributer3' AS VARCHAR(50)) Title
END
GO
/****** Object:  StoredProcedure [dbo].[LoadDistributArea]    Script Date: 1/19/2016 10:24:06 AM ******/
CREATE Procedure [dbo].[LoadDistributArea]
AS
BEGIN 
	Select
		1 ID
		,CAST('DistributArea1' AS VARCHAR(50)) Title
UNION
	Select
		2 ID
		,CAST('DistributArea2' AS VARCHAR(50)) Title
UNION
	Select
		3 ID
		,CAST('DistributArea3' AS VARCHAR(50)) Title
UNION
	Select
		4 ID
		,CAST('DistributArea4' AS VARCHAR(50)) Title
UNION
	Select
		5 ID
		,CAST('DistributArea5' AS VARCHAR(50)) Title
UNION
	Select
		6 ID
		,CAST('DistributArea6' AS VARCHAR(50)) Title
END
GO
/****** Object:  StoredProcedure [dbo].[LoadCustomer]    Script Date: 1/19/2016 10:24:06 AM ******/
CREATE Procedure [dbo].[LoadCustomer]
	@Group INT,
	@Title VARCHAR(50)
As 
BEGIN
SELECT ID,Title
FROM (

			Select
				1 ID
				,CAST('Customer11' AS VARCHAR(50)) Title
				,1 AS GroupId
		UNION
			Select
				2 ID
				,CAST('Customer12' AS VARCHAR(50)) Title
				,1 AS GroupId
		UNION
			Select
				3 ID
				,CAST('Customer21' AS VARCHAR(50)) Title
				,2 AS GroupId
		UNION
			Select
				4 ID
				,CAST('Customer22' AS VARCHAR(50)) Title
				,2 AS GroupId
		UNION
			Select
				5 ID
				,CAST('Customer31' AS VARCHAR(50)) Title
				,3 AS GroupId
		UNION
			Select
				6 ID
				,CAST('Customer32' AS VARCHAR(50)) Title
				,3 AS GroupId
) AS VisitorTable
WHERE ( (@group = -1) OR (GroupId = @group) )
AND (Title LIKE '%'+@Title+'%')
END
GO
/****** Object:  StoredProcedure [dbo].[LoadAllVisitorGroups]    Script Date: 02/04/2016 00:04:48 ******/
/****** Object:  StoredProcedure [dbo].[LoadAllVisitorGroups]    Script Date: 1/19/2016 10:24:06 AM ******/
CREATE Procedure [dbo].[LoadAllVisitorGroups]
As 
BEGIN
	SELECT
		1 ID
		,CAST('VisGroup1' AS VARCHAR(50)) Title
UNION
	SELECT
		2 ID
		,CAST('VisGroup2' AS VARCHAR(50)) Title
UNION
	SELECT
		3 ID
		,CAST('VisGroup3' AS VARCHAR(50)) Title
END
GO
/****** Object:  StoredProcedure [dbo].[LoadAllGoodGroups]    Script Date: 1/19/2016 10:24:06 AM ******/
CREATE Procedure [dbo].[LoadAllGoodGroups]
As 
BEGIN
	Select
		1 ID
		,CAST('GoodGroup1' AS VARCHAR(50)) Title
UNION
	Select
		2 ID
		,CAST('GoodGroup2' AS VARCHAR(50)) Title
END
GO
/****** Object:  StoredProcedure [dbo].[LoadAllCustomerGroups]    Script Date: 02/04/2016 00:04:48 ******/
CREATE Procedure [dbo].[LoadAllCustomerGroups]
As
BEGIN 
	Select
		1 ID
		,CAST('CustomerGroup1' AS VARCHAR(50)) Title
UNION
	Select
		2 ID
		,CAST('CustomerGroup2' AS VARCHAR(50)) Title
UNION
	Select
		3 ID
		,CAST('CustomerGroup3' AS VARCHAR(50)) Title
UNION
	Select
		4 ID
		,CAST('CustomerGroup4' AS VARCHAR(50)) Title
END
GO

CREATE Procedure [dbo].[LoadActivity]
AS
BEGIN 
	Select
		1 ID
		,CAST('Activity1' AS VARCHAR(50)) Title
UNION
	Select
		2 ID
		,CAST('Activity2' AS VARCHAR(50)) Title
END
GO
/****** Object:  Table [dbo].[area_point]    Script Date: 02/04/2016 00:04:49 ******/
CREATE TABLE [dbo].[area_point](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[master_id] [int] NOT NULL,
	[latitude] [float] NOT NULL,
	[longitude] [float] NOT NULL,
 CONSTRAINT [PK_dbo.area_point] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
