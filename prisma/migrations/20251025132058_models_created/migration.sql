BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Person] (
    [id] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [picture] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Person_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Person_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Project] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] TEXT,
    [startDate] DATETIME2 NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [teamLeadId] NVARCHAR(1000) NOT NULL,
    [clientName] NVARCHAR(1000) NOT NULL,
    [latestUpdate] TEXT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Project_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Project_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ProjectAttachment] (
    [id] NVARCHAR(1000) NOT NULL,
    [fileName] NVARCHAR(1000) NOT NULL,
    [fileUrl] NVARCHAR(1000) NOT NULL,
    [fileType] NVARCHAR(1000),
    [fileSize] INT,
    [projectId] NVARCHAR(1000) NOT NULL,
    [uploadedAt] DATETIME2 NOT NULL CONSTRAINT [ProjectAttachment_uploadedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ProjectAttachment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Hardware] (
    [id] NVARCHAR(1000) NOT NULL,
    [dateOfPurchase] DATETIME2 NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] TEXT,
    [issuedToId] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Hardware_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Hardware_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[TeamMember] (
    [id] NVARCHAR(1000) NOT NULL,
    [personId] NVARCHAR(1000) NOT NULL,
    [projectId] NVARCHAR(1000) NOT NULL,
    [joinedAt] DATETIME2 NOT NULL CONSTRAINT [TeamMember_joinedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [TeamMember_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [TeamMember_personId_projectId_key] UNIQUE NONCLUSTERED ([personId],[projectId])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Project_teamLeadId_idx] ON [dbo].[Project]([teamLeadId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ProjectAttachment_projectId_idx] ON [dbo].[ProjectAttachment]([projectId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Hardware_issuedToId_idx] ON [dbo].[Hardware]([issuedToId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [TeamMember_personId_idx] ON [dbo].[TeamMember]([personId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [TeamMember_projectId_idx] ON [dbo].[TeamMember]([projectId]);

-- AddForeignKey
ALTER TABLE [dbo].[Project] ADD CONSTRAINT [Project_teamLeadId_fkey] FOREIGN KEY ([teamLeadId]) REFERENCES [dbo].[Person]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProjectAttachment] ADD CONSTRAINT [ProjectAttachment_projectId_fkey] FOREIGN KEY ([projectId]) REFERENCES [dbo].[Project]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Hardware] ADD CONSTRAINT [Hardware_issuedToId_fkey] FOREIGN KEY ([issuedToId]) REFERENCES [dbo].[Person]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TeamMember] ADD CONSTRAINT [TeamMember_personId_fkey] FOREIGN KEY ([personId]) REFERENCES [dbo].[Person]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TeamMember] ADD CONSTRAINT [TeamMember_projectId_fkey] FOREIGN KEY ([projectId]) REFERENCES [dbo].[Project]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
