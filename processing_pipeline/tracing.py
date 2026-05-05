from opentelemetry import trace , propagate
from opentelemetry.propagators.textmap import DefaultGetter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
import os
import json

def setup_tracing():
    resource = Resource.create({
        "service.name": os.getenv("OTEL_SERVICE_NAME", "cups-pipeline"),
        "service.version": "1.0.0",
        "deployment.environment": os.getenv("ENV", "development"),
    })

    exporter = OTLPSpanExporter(
        endpoint=os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "http://otel-collector:4317"),
        insecure=True
    )

    provider = TracerProvider(resource=resource)
    provider.add_span_processor(BatchSpanProcessor(exporter))
    trace.set_tracer_provider(provider)

class DictGetter(DefaultGetter):
    def get(self, carrier, key):
        val = carrier.get(key)
        return [val] if val else []
    
    def keys(self, carrier):
        return list(carrier.keys())

def continue_trace(trace_context_json: str):
    carrier = json.loads(trace_context_json)
    ctx = propagate.extract(carrier, getter=DictGetter())
    return ctx