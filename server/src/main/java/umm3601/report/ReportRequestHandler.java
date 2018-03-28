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
