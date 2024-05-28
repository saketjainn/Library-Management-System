package com.project.library.management.service;

import com.project.library.management.exception.BookNotFoundException;
import com.project.library.management.exception.ReportGenerationException;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.util.Date;

public interface ReportService {

    ByteArrayOutputStream generateReport(JRBeanCollectionDataSource dataSource, String jrxmlFileName, String username, Date startDate, Date endDate) throws FileNotFoundException, JRException, ReportGenerationException;

    Date setTimeInEndDate(Date endDate, int hour, int minute, int second);

    ByteArrayOutputStream getAdminReport(String username, String reportName, Date startDate, Date endDate) throws FileNotFoundException, ReportGenerationException, JRException;

    ByteArrayOutputStream getUserReport(String username, String reportName, Date startDate, Date endDate) throws FileNotFoundException, ReportGenerationException, JRException;

    ByteArrayOutputStream generateAdminBooksCollectionReport(Date startDate, Date endDate, String username) throws JRException, FileNotFoundException, ReportGenerationException;

    ByteArrayOutputStream generateUserBooksCollectionReport(Date startDate,Date endDate,String username) throws JRException, FileNotFoundException, ReportGenerationException;

    ByteArrayOutputStream generateBookIssuanceSummaryReport(Date startDate, Date endDate, String username) throws FileNotFoundException, ReportGenerationException, JRException;

    ByteArrayOutputStream generateBookReturnSummaryReport(Date startDate, Date endDate, String username) throws FileNotFoundException, ReportGenerationException, JRException;

    ByteArrayOutputStream generateUserBookIssuanceSummaryReport(Date startDate, Date endDate, String username) throws FileNotFoundException, ReportGenerationException, JRException;

    ByteArrayOutputStream generateUserRequestSummaryReport(Date startDate, Date endDate, String username) throws FileNotFoundException, ReportGenerationException, JRException;

    ByteArrayOutputStream generateAllUserDataReport(String username) throws FileNotFoundException, JRException, ReportGenerationException;

    ByteArrayOutputStream generateBookRequestReport(Date startDate, Date endDate, String username) throws FileNotFoundException, JRException, ReportGenerationException;

    ByteArrayOutputStream generateAllPublisherDataReport(String username) throws FileNotFoundException, JRException, ReportGenerationException;

    ByteArrayOutputStream generateFineSummaryReport(String username) throws FileNotFoundException, ReportGenerationException, JRException;
}
