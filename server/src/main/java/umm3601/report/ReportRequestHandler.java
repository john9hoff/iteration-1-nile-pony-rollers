package umm3601.report;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;
import java.util.Date;

/**
 * Created by Brian on 11/29/2017.
 */
public class ReportRequestHandler {

    private final ReportController reportController;
    public ReportRequestHandler(ReportController reportController){
        this.reportController = reportController;
    }
    /**Method called from Server when the 'api/trackers/:id' endpoint is received.
     * Get a JSON response with a list of all the reports in the database.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one tracker in JSON formatted string and if it fails it will return text with a different HTTP status code
     */
    public String getReportJSON(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String report;
        try {
            report = reportController.getReport(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested tracker id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (report != null) {
            return report;
        } else {
            res.status(404);
            res.body("The requested report with id " + id + " was not found");
            return "";
        }
    }



    /**Method called from Server when the 'api/trackers' endpoint is received.
     * This handles the request received and the response
     * that will be sent back.
     *@param req the HTTP request
     * @param res the HTTP response
     * @return an array of trackers in JSON formatted String
     */
    public String getReports(Request req, Response res)
    {
        res.type("application/json");
        return reportController.getReports(req.queryMap().toMap());
    }



}
