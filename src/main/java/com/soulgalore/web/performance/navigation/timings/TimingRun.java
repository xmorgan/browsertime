package com.soulgalore.web.performance.navigation.timings;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import java.util.*;

public class TimingRun {
    private final Map<String, TimingMark> marks = new HashMap<String, TimingMark>();
    private final List<TimingMeasurement> measurements = new ArrayList<TimingMeasurement>();

    public void addMark(TimingMark mark) {
        marks.put(mark.getName(), mark);
    }

    public TimingMark getMark(String name) {
        return marks.get(name);
    }

    @XmlElementWrapper(name = "marks")
    @XmlElement(name = "mark")
    public Collection<TimingMark> getMarks() {
        return Collections.unmodifiableCollection(marks.values());
    }

    public void addMeasurement(TimingMeasurement measurement) {
        measurements.add(measurement);
    }

    @XmlElementWrapper(name = "measurements")
    @XmlElement(name = "measurement")
    public List<TimingMeasurement> getMeasurements() {
        return Collections.unmodifiableList(measurements);
    }
}
