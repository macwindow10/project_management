BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Project] ADD [database] NVARCHAR(1000) NOT NULL CONSTRAINT [Project_database_df] DEFAULT '',
[deploymentDetails] NVARCHAR(1000) NOT NULL CONSTRAINT [Project_deploymentDetails_df] DEFAULT '',
[toolStack] NVARCHAR(1000) NOT NULL CONSTRAINT [Project_toolStack_df] DEFAULT '',
[usersCount] INT NOT NULL CONSTRAINT [Project_usersCount_df] DEFAULT 0;

-- CreateTable
CREATE TABLE [dbo].[Task] (
    [id] NVARCHAR(1000) NOT NULL,
    [projectId] NVARCHAR(1000) NOT NULL,
    [personId] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [startDate] DATETIME2 NOT NULL,
    [endDate] DATETIME2 NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Task_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Task_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Task_projectId_idx] ON [dbo].[Task]([projectId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Task_personId_idx] ON [dbo].[Task]([personId]);

-- AddForeignKey
ALTER TABLE [dbo].[Task] ADD CONSTRAINT [Task_projectId_fkey] FOREIGN KEY ([projectId]) REFERENCES [dbo].[Project]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Task] ADD CONSTRAINT [Task_personId_fkey] FOREIGN KEY ([personId]) REFERENCES [dbo].[Person]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
